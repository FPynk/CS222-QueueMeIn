import { create } from "zustand"

const useStore = create((set) => ({
    email: "",
    isRecruiter: false,
    currentEventID: "",
    setEmail: (em) => set(() => ({email: em})),
    setIsRecruiter: (bool) => set(() => ({isRecruiter: bool})),
    setCurrentEventID: (id) => set(() => ({currentEventID: id})),
}));

export default useStore;