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
	message?: number;
};

export type Message = {
	id: number;
	author: Author;
	text: string;
	created_at: Date;
	reactions: Reaction[];
};

// consts
export const REACTION_OPTIONS = ['👍', '👎', '❤️', '🔥', '👀'];
export const AVATAR_BG_LIST = ['bg-primary-500', 'bg-secondary-500', 'bg-tertiary-500'];
const MESSAGE_QUERY = `
	*, 
	author ( profile_img_url, display_name, id), 
	reactions (id, emoji, user ( profile_img_url, display_name, id))
`;
const INIT_CHAT_INDEX = 7;
const CHAT_INCREMENT = 5;

// store
let chatCount = INIT_CHAT_INDEX;
export const chat = writable<Message[]>([]);
export const loadChat = async () => {
	const { data } = await supabase
		.from('messages')
		.select(MESSAGE_QUERY)
		.order('created_at', { ascending: false })
		.range(0, INIT_CHAT_INDEX);

	if (!data) return;

	chat.set(data.reverse());
	supabase
		.channel('public:messages')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'messages'
			},
			async (payload) => {
				const { eventType, old: oldMessage, new: newMessage } = payload;
				if (eventType === 'INSERT') {
					const { data: author } = await supabase
						.from('user_profiles')
						.select('*')
						.eq('id', newMessage.author);
					if (!author) return;
					addMessageToStore({
						...newMessage,
						author: author[0],
						reactions: newMessage.reactions ?? []
					} as Message);
				}
				if (eventType === 'DELETE') {
					removeMessageFromStore(oldMessage.id);
				}
			}
		)
		.subscribe();

	supabase
		.channel('public:reactions')
		.on(
			'postgres_changes',
			{
				event: '*',
				schema: 'public',
				table: 'reactions'
			},
			async (payload) => {
				const { eventType, old: oldReaction, new: newReaction } = payload;
				if (eventType === 'INSERT') {
					const { data: user } = await supabase
						.from('user_profiles')
						.select('*')
						.eq('id', newReaction.user);
					if (!user) return;
					addReactionToStore({ ...newReaction, user: user[0] } as Reaction);
				}
				if (eventType === 'DELETE') {
					removeReactionFromStore(oldReaction.id);
				}
			}
		)
		.subscribe();
};

export function removeMessageFromStore(id: number) {
	const chatStore = get(chat);
	const newChat = chatStore.filter((message) => message.id !== id);
	chat.set(newChat);
}

export function addMessageToStore(message: Message) {
	const chatStore = get(chat);
	chat.set([...chatStore, message]);
}

export function addReactionToStore(reaction: Reaction) {
	chat.update((messages) => {
		const messageIndex = messages.findIndex((message) => message.id === reaction.message);
		if (messageIndex === -1) return messages;
		const newMessage = messages[messageIndex];
		newMessage.reactions = [...newMessage.reactions, reaction] as Reaction[];
		const newMessages = [...messages];
		newMessages[messageIndex] = newMessage;
		return newMessages;
	});
}

export function removeReactionFromStore(reactionId: number) {
	chat.update((messages) => {
		const messageIndex = messages.findIndex((message) =>
			message.reactions.find((r) => r.id === reactionId)
		);

		if (messageIndex === -1) return messages;
		const newMessage = messages[messageIndex];
		newMessage.reactions = newMessage.reactions.filter((r) => r.id !== reactionId);
		const newMessages = [...messages];
		newMessages[messageIndex] = newMessage;
		return newMessages;
	});
}

export const loadMore = async () => {
	const { data } = await supabase
		.from('messages')
		.select(MESSAGE_QUERY)
		.order('created_at', { ascending: false })
		.range(chatCount + 1, chatCount + CHAT_INCREMENT);
	if (!data) return;
	chat.set([...data.reverse(), ...get(chat)]);
	chatCount += CHAT_INCREMENT;
};

export const createMessage = async (message: string, author: string) => {
	// Creates a new message in the database
	const { data, error } = await supabase.from('messages').insert([{ text: message, author }]);
	if (error) console.log(error);
};

export const deleteMessageById = async (id: number) => {
	// Deletes a message from the database
	const { data, error } = await supabase.from('messages').delete().match({ id });
	if (error) console.log(error);
};

export const createReaction = async (messageId: number, emoji: string, userId: string) => {
	// Adds a reaction to a message
	const { data, error } = await supabase
		.from('reactions')
		.insert([{ message: messageId, emoji, user: userId }])
		.select('id, emoji, user ( profile_img_url, display_name, id)');
	if (error) console.log(error);
};

export const deleteReaction = async (reactionId: number) => {
	// Removes a reaction from a message
	const { data, error } = await supabase
		.from('reactions')
		.delete()
		.match({ id: reactionId })
		.select();
	if (error) console.log(error);
};
