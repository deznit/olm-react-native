import produce from 'immer';
import {
    CLEAR_TEAMS_FORM,
    LEAVE_TEAM,
    JOIN_TEAM_SUCCESS,
    TEAMS_FORM_ERROR,
    TEAMS_FORM_SUCCESS,
    TEAMS_REQUEST_ERROR,
    TOP_TEAMS_REQUEST_SUCCESS,
    USER_TEAMS_REQUEST_SUCCESS,
    SET_SELECTED_TEAM
} from '../actions/types';

const INITIAL_STATE = {
    topTeams: [],
    userTeams: [],
    teamsRequestStatus: '',
    selectedTeam: {},
    teamsFormError: '',
    teamFormStatus: null, // SUCCESS || ERROR
    successMessage: ''
};

export default function(state = INITIAL_STATE, action) {
    return produce(state, draft => {
        switch (action.type) {
            case CLEAR_TEAMS_FORM:
                draft.teamsFormError = '';
                draft.successMessage = '';
                draft.teamFormStatus = null;
                break;
            case LEAVE_TEAM:
                const index = draft.userTeams.findIndex(
                    team => team.id === action.payload?.id
                );
                if (index !== -1) {
                    draft.userTeams.splice(index, 1);
                }

                break;
            case TEAMS_FORM_ERROR:
                draft.teamsFormError = action.payload;

                break;
            case TEAMS_REQUEST_ERROR:
                draft.teamsRequestStatus = action.payload;
                draft.teamFormStatus = 'ERROR';

                break;

            case TEAMS_FORM_SUCCESS:
                draft.userTeams.push(action.payload.team);
                draft.teamFormStatus = 'SUCCESS';
                action.payload.type === 'JOIN'
                    ? (draft.successMessage =
                          'Congrats! you have joined a new team')
                    : (draft.successMessage =
                          'Congrats! you created a new team');

                break;
            case TOP_TEAMS_REQUEST_SUCCESS:
                draft.topTeams = action.payload;

                break;

            case USER_TEAMS_REQUEST_SUCCESS:
                draft.userTeams = action.payload;

                break;

            case JOIN_TEAM_SUCCESS:
                draft.userTeams.push(action.payload.team);

                break;

            case SET_SELECTED_TEAM:
                draft.selectedTeam = action.payload;

                break;

            default:
                return draft;
        }
    });
}
