import { create } from "zustand";

export const useStore = create((set) => ({
  posts: [],
  page: 1,
  onSearch: false,
  searchValue: "",
  details: {},
  ismodalOpen: false,
  isloading: false,
  category: "discover",

  setPosts: (newPosts) => set(() => ({ posts: newPosts })),
  setPage: (newPage) => set({ page: newPage }),
  searchMovie: (searchedMovie) => set({ searchValue: searchedMovie }),
  setModalOnOff:() => set((state) => ({ ismodalOpen: !state.ismodalOpen })),
  setisLoading:() => set((state) => ({ isloading: !state.isloading })),
  changeCategory: () => set((newCategory) => ({ Category: newCategory })),
  setOnSearch :() => set((state) => ({ onSearch: !state.onSearch })),
  // setDetails: () => set((newDetails) => ({ details: newDetails})),

  searchInput: () => set((searchInput) => ({ searchValue: searchInput})),

}));
