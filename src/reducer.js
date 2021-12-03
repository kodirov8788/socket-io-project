export const initialState = {
  basket: [],
  wishlist: [],
  user: null,
  category: "all",
  userEmail: null,
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };

    case "EMPTY_BASKET":
      return {
        ...state,
        basket: [],
      };
    case "SET_CATEGORY":
      return {
        ...state,
        category: action.category,
      };
    case "SET_USEREMAIL":
      return {
        ...state,
        userEmail: action.userEmail,
      };

    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action.id}) as its not in basket!`
        );
      }
      return {
        ...state,
        basket: newBasket,
      };

    case "ADD_TO_WISHLIST":
      return {
        ...state,
        wishlist: [...state.wishlist, action.item],
      };

    case "EMPTY_WISHLIST":
      return {
        ...state,
        wishlist: [],
      };

    case "REMOVE_FROM_WISHLIST":
      const index2 = state.wishlist.findIndex(
        (wishlistItem) => wishlistItem.id === action.id
      );
      let newWishlist = [...state.wishlist];

      if (index2 >= 0) {
        newWishlist.splice(index2, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action.id}) as its not in wishlist!`
        );
      }

      return {
        ...state,
        wishlist: newWishlist,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};

export default reducer;
