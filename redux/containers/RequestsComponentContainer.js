import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { StyleSheet, DatePickerIOS, View } from 'react-native';
import RequestsComponent from '../../components/RequestsComponent';
import GetMeetupsProcess from '../thunks/GetMeetupsProcess';
import GetParticipantsProcess from '../thunks/GetParticipantsProcess';
import GetMeetupsAndParticipantsProcess from '../thunks/GetMeetupsAndParticipantsProcess';
import UpdateParticipantsProcess from '../thunks/UpdateParticipantsProcess'

function mapStateToProps(state, ownProps) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onMount: () => dispatch(GetMeetupsProcess()),
    onRerender: nextProps => {
      if (nextProps.id) {
        for (i = 0; i < nextProps.length; i++) {
          dispatch(GetMeetupsProcess());
        }
      }
    },
    onSubmit: classes => {
      for (i = 0; i < classes.length; i++) {
        dispatch(
          updateClassesProcess(classes[i].id, { active: true })
        ).then(() => dispatch(getClassesProcess('get')));
      }
    },
    onUpdateStatus:(id,fieldChange)=>dispatch(UpdateParticipantsProcess(id,fieldChange)),
    onCheck: () => dispatch({ type: 'CHECKSTATE' }),
    onGoBack: () => dispatch({ type: 'GO_BACK' }),
    onSearch: () => dispatch({ type: 'GO_TO_SEARCH' })
  };
}

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

const onDidMount = lifecycle({
  componentDidMount() {
    this.props.onMount();
  },
  componentWillReceiveProps(nextProps) {
    if (this.props.meetups !== nextProps.meetups) {
      this.props.onRerender(nextProps);
    }
  }
});

export default compose(connectToStore, onDidMount)(RequestsComponent);
