export function isChannelMessage(
  message: StoredMessage<'contact'> | StoredMessage<'channel'>
): message is StoredMessage<'channel'> {
  return typeof message.sender === 'object' && typeof message.recipient === 'object';
}
