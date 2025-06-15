import { create } from "zustand";

export const useStore = create((set) => ({
  page: 1,
  onSearch: false,
  searchValue: "",
  ismodalOpen: false,
  isloading: false,
  category: "discover",

  setPosts: (newPosts) => set(() => ({ posts: newPosts })),
  setPage: (newPage) => set({ page: newPage }),
  searchMovie: (searchedMovie) => set({ searchValue: searchedMovie }),
  setModalOnOff:() => set((state) => ({ ismodalOpen: !state.ismodalOpen })),
  setisLoading:() => set((bool) => ({ isloading: bool })),
  changeCategory: () => set((newCategory) => ({ Category: newCategory })),
  setOnSearch :() => set((state) => ({ onSearch: !state.onSearch })),
  // setDetails: () => set((newDetails) => ({ details: newDetails})),

  setSearchValue: () => set((searchInput) => ({ searchValue: searchInput})),

}));
