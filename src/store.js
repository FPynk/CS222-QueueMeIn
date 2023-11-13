import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"


/* SHORT DOCUMENTATION
In a react function (NOT auxiliary, they must have something 'return <></>')
use the following code to access data:

    import { userStore } from '../../store'

    const user = userStore((state) => state)
    
    Then you can use the following getters
        user.email
        user.isRecruiter
        user.eventID

    And the setters
        user.setEmail('string')
        user.setIsRecruiter('bool')
        user.setEventID('string')

    If you want to use the getters/setters in an auxilary javascript function,
    pass in user as a parameter.
*/

const userStore = create(
        devtools(
            persist(
                (set) => ({
                    email: "",
                    isRecruiter: false,
                    eventID: "",
                    setEmail: (em) => set(() => ({email: em})),
                    setIsRecruiter: (bool) => set(() => ({isRecruiter: bool})),
                    setEventID: (id) => set(() => ({eventID: id})),
                }), {
                    name: "store"
                }
            )   
        ));

export { userStore };