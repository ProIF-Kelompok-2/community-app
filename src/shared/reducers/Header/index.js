

const mark_as_read_reducer = (state,action) =>{
    switch(action.type){
        case 'MARK_AS_READ':
            const index = state.notification.findIndex(mark_as_read_reducer => mark_as_read_reducer.id === action.payload.id)
            return{
                ...state,
                notification:[
                    ...state.notification.slice(0,index),
                    {
                        ...notification[index],
                        read:true,
                    },
                    ...state.notification.slice(index+1),
                ]
            };
            break;
        case 'MARK_ALL_AS_READ':
            return {

            }
        default:
            return state;
    }
}