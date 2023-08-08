import { supabase } from '$lib/supabaseClient';
import { writable, get } from 'svelte/store';

export type Author = {
	id: string;
	display_name: string;
	profile_img_url: string;
};

export type Reaction = {
	id: number;
	emoji: string;
	user: Author;
};

export type Message = {
	id: number;
	author: Author;
	text: string;
	created_at: Date;
	reactions: Reaction[];
};

export const chat = writable<Message[]>([]);
const MESSAGE_QUERY = `
	*, 
	author ( profile_img_url, display_name, id), 
	reactions (id, emoji, user ( profile_img_url, display_name, id))
`;
const INIT_CHAT_COUNT = 10;
let chatCount = INIT_CHAT_COUNT;
const TABLE_NAME = 'messages';

export const loadChat = async () => {
	const { data, error } = await supabase
		.from(TABLE_NAME)
		.select(MESSAGE_QUERY)
		.order('created_at', { ascending: false })
		.limit(INIT_CHAT_COUNT);

	if (!data) return;

	chat.set(data.reverse());
	const channel = supabase
		.channel('public:messages')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: TABLE_NAME
			},
			async (payload) => {
				const { eventType, old: oldMessage, new: newMessage } = payload;
				if (eventType === 'INSERT') {
					const { data: author } = await supabase
						.from('user_profiles')
						.select('*')
						.eq('id', newMessage.author);
					if (!author) return;
					addMessage({ ...newMessage, author: author[0] } as Message);
				}
				if (eventType === 'DELETE') {
					deleteMessage(oldMessage.id);
				}
			}
		)
		.subscribe();
};

export function deleteMessage(id: number) {
	const chatStore = get(chat);
	const newChat = chatStore.filter((message) => message.id !== id);
	chat.set(newChat);
}

export function addMessage(message: Message) {
	const chatStore = get(chat);
	chat.set([...chatStore, message]);
}

export const loadMore = async () => {
	chatCount += 5;
	const { data, error } = await supabase
		.from(TABLE_NAME)
		.select(MESSAGE_QUERY)
		.order('id', { ascending: false })
		.limit(chatCount);
	if (!data) return;
	chat.set(data.reverse());
};

export const createMessage = async (message: string, author: string) => {
	// Creates a new message in the database
	const { data, error } = await supabase.from(TABLE_NAME).insert([{ text: message, author }]);
	if (error) console.log(error);
};
