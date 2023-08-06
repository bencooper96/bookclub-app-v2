import { supabase } from '$lib/supabaseClient';
import { writable, get } from 'svelte/store';

type Message = {
	id: number;
	author: {
		id: string;
		display_name: string;
		profile_img_url: string;
	};
	text: string;
	created_at: Date;
};

export const chat = writable<Message[]>([]);

const INIT_CHAT_COUNT = 25;
const TABLE_NAME = 'messages';

export const loadChat = async () => {
	const { data, error } = await supabase
		.from(TABLE_NAME)
		.select(`*, author ( profile_img_url, display_name, id)`)
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
				console.log('payload', payload);
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
	//   const { data, error } = await supabase
	//     .from(tableName)
	//     .select()
	//     .order('id', { ascending: false })
	//     .limit((INIT_CHAT_COUNT += 5))
	//   chat.set(data.reverse())
};

export const sendMessage = async () => {
	//   const { data, error } = await supabase
	//     .from(tableName)
	//     .insert([{ username, message, replied_to_id, replied_to_message, replied_to_username }])
	//   loadChat()
};
