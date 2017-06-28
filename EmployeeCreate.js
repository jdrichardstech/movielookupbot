import React, { Component } from 'react'
import { Text, Picker } from 'react-native'
import  { Card, CardSection, Input, Button } from './common'
import { connect } from 'react-redux'
import actions from '../actions/employeeActions'
import EmployeeForm from './EmployeeForm'

class EmployeeCreate extends Component{

	onButtonPress(){
		const {name, phone, shift} = this.props
		this.props.employeeCreate({name, phone, shift: shift || "Monday"})
	}

	render(){
		return(
			<Card>
				<EmployeeForm {...this.props} />

				<CardSection>
					<Button
						onPress={this.onButtonPress.bind(this)}
						>
						Create
					</Button>
				</CardSection>
			</Card>
		)
	}
}



const stateToProps = (state)=>{
	const {name, phone, shift } = state.employeeForm
	return {name, phone, shift}
}

const dispatchToProps = (dispatch) => {
	return{
		employeeUpdate: ({prop, value}) => dispatch(actions.employeeUpdate({prop, value})),
		employeeCreate: ({name, phone, shift}) => dispatch(actions.employeeCreate({name, phone, shift}))
	}
}
export default connect(stateToProps, dispatchToProps)(EmployeeCreate)
