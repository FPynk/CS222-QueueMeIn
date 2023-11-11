import { create } from "zustand"


/* SHORT DOCUMENTATION
In a component, use the following code to access data:

    import { useStore } from '..\..\store'

    useStore.getState().setEmail("A")
    useStore.getState().email

useStore.getState() returns the object from the arrow function of create()
*/

const useStore = create((set) => ({
    email: "",
    isRecruiter: false,
    currentEventID: "",
    setEmail: (em) => set(() => ({email: em})),
    setIsRecruiter: (bool) => set(() => ({isRecruiter: bool})),
    setCurrentEvent: (id) => set(() => ({currentEvent: id})),
}));

export { useStore } ;