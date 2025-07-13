export function isContactMessage(
  message: StoredMessage<'contact'> | StoredMessage<'channel'>
): message is StoredMessage<'contact'> {
  return typeof message.sender === 'string' && typeof message.recipient === 'string';
}
