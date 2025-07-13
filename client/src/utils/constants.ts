export const HOST = import.meta.env.VITE_SERVER_URL

export const authRoute = 'api/auth'
export const signupRoute = `${authRoute}/signup`
export const loginRoute = `${authRoute}/login`
export const userInfoRoute = `${authRoute}/user-info`
export const updateProfileRoute = `${authRoute}/update-profile`
export const addProfileImageRoute = `${authRoute}/add-profile-image`
export const removeProfileImageRoute = `${authRoute}/remove-profile-image`
export const logoutRoute = `${authRoute}/logout`

export const contactsRoute = `api/contacts`
export const searchContactsRoute = `${contactsRoute}/search`
export const getContactsForDMRoute = `${contactsRoute}/get-contacts-for-dm`
export const getAllContactsRoute = `${contactsRoute}/get-all-contacts`

export const messagesRoute = `api/messages`
export const getMessagesRoute = `${messagesRoute}/get-messages`
export const uploadFileRoute = `${messagesRoute}/upload-file`

export const channelRoute = `api/channels`
export const createChannelRoute = `${channelRoute}/create-channel`
export const getUserChannelsRoute = `${channelRoute}/get-user-channels`
export const getChannelMessagesRoute = `${channelRoute}/get-channel-messages`

