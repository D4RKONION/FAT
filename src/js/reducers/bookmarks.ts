import { Bookmark } from "../types";

type BookmarksReducerAction = {
  type: 'ADD_BOOKMARK' | 'REMOVE_BOOKMARK' | 'CLEAR_ALL_BOOKMARKS';
  bookmarkToAdd: Bookmark;
  bookmarkToRemove: number;
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

    case 'CLEAR_ALL_BOOKMARKS':
      return defaultState;


    default:
      return state;
  }
}