import { writable, get } from 'svelte/store';
export const chat = writable([]);

let isAdded = false;
let initChatCount = 25;
let tableName = 'global_chat';

export const loadChat = async () => {
	//   const { data, error } = await supabase.from(tableName).select().order('id', { ascending: false }).limit(initChatCount)
	//   chat.set(data.reverse())
	//   const mySubscription = supabase
	//     .from(tableName)
	//     .on('INSERT', (payload) => {
	//       chat.set([...data, payload.new])
	//       loadChat()
	//     })
	//     .subscribe()
};

export const loadMore = async () => {
	//   const { data, error } = await supabase
	//     .from(tableName)
	//     .select()
	//     .order('id', { ascending: false })
	//     .limit((initChatCount += 5))
	//   chat.set(data.reverse())
};

export const sendMessage = async (
	username,
	message,
	replied_to_id,
	replied_to_message,
	replied_to_username
) => {
	//   const { data, error } = await supabase
	//     .from(tableName)
	//     .insert([{ username, message, replied_to_id, replied_to_message, replied_to_username }])
	//   loadChat()
};

export const replyData = async (id) => {
	//   const { data, error } = await supabase.from(tableName).select().eq('id', id)
	//   if (error) {
	//     return console.error(error)
	//   }
	//   console.log('chatstore (replydata):', data)
	//   return data
};
