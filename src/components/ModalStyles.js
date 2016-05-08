import _ from 'lodash';

const modalStyle = {
    position: 'fixed',
    zIndex: 1040,
    top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = _.extend(_.clone(modalStyle),{
    zIndex: 'auto',
    backgroundColor: '#000',
    opacity: 0.5
});

const dialogStyle =
{
    position: 'absolute',
    width: 'auto',
    height:'auto',
    top: 50 + '%', left: 50 + '%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20,
    maxHeight:'100%',
    overflowY:'scroll'
};

export default {
    modalStyle:modalStyle,
    backdropStyle:backdropStyle,
    dialogStyle:dialogStyle
}