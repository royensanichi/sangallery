import { create } from "zustand";
 
export const useStore = create((set) => ({
  posts: [],
  page: 1,
  onSearch: false,
  searchValue: "",
  details: {},
  ismodalOpen: false,
  isloading: false,
  section: "discover",
}));

export const setPosts = (newPosts) => set(() => ({posts: newPosts}));

export const increasePage = () => set((state) => ({ page: state.page + 1 }));
export const previousPage = () => set((state) => ({ page: state.page - 1 }));
export const firstPage = () => set({ page: 0 });
export const lastPage = () => set({ page: 500 });

export const changeSection = () =>
  set((newSection) => ({ section: newSection }));
export const searchPage = (searchedPage) => set({ page: searchedPage });

export const searchMovie = (searchedMovie) =>
  set({ searchValue: searchedMovie });

export const setModalOnOff = () =>
  set((state) => ({ isloading: !state.isloading }));

export const setOnSearch = () =>
  set((state) => ({ onSearch: !state.onSearch }));
