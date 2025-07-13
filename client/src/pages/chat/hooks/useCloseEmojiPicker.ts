import {type Dispatch, type RefObject, type SetStateAction, useEffect} from 'react'

export const useCloseEmojiPicker = (emojiRef: RefObject<HTMLDivElement | null>, setEmojiPickerOpen:Dispatch<SetStateAction<boolean>>) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setEmojiPickerOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  },[emojiRef, setEmojiPickerOpen])
}
