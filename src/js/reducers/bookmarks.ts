import { Bookmark } from "../types";

type BookmarksReducerAction = {
  type: 'ADD_BOOKMARK' | 'REMOVE_BOOKMARK' | 'CLEAR_ALL_BOOKMARKS' | 'REORDER_BOOKMARKS';
  bookmarkToAdd: Bookmark;
  bookmarkToRemove: number;
  reorderedBookmarkArray: string[];
}

const defaultState: Bookmark[] = []

export const bookmarksReducer = (state = defaultState, action: BookmarksReducerAction) => {
  switch(action.type) {

    case 'ADD_BOOKMARK':
      return [
        ...state,
        action.bookmarkToAdd
      ]

    case 'REMOVE_BOOKMARK':
      return [
        ...state.filter((_, i) => i !== action.bookmarkToRemove )
      ]

    case 'REORDER_BOOKMARKS':
      console.log(action.reorderedBookmarkArray)
      return action.reorderedBookmarkArray;

    case 'CLEAR_ALL_BOOKMARKS':
      return defaultState;


    default:
      return state;
  }
}