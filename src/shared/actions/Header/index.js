import { createActions } from 'redux-actions';

function MARK_AS_READ(){
    return{
        type:'MARK_AS_READ',
    }
}
function MARK_ALL_AS_READ(){
    return{
        type:'MARK_ALL_AS_READ'
    }
}
function DELETE(){
    return{
        type:'DELETE'
    }
}

export default createActions({
    HEADER:{
        MARK_AS_READ : MARK_AS_READ,
        MARK_ALL_AS_READ: MARK_ALL_AS_READ,
        DELETE :DELETE
    }
});