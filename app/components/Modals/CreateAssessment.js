import React, { Component } from 'react';
import Modal from './ModalTemplate';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import { modalStyle } from '../../styles.js';
import moment from 'moment';


const { Input, RadioGroup , Checkbox} = FRC;


export default class CreateAssessment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canSubmit: false
    }
    this.submitForm = this.submitForm.bind(this);
    this.enableSubmitButton = this.enableSubmitButton.bind(this);
    this.disableSubmitButton = this.disableSubmitButton.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
  }

  submitForm(){
    var myform = this.myform.getModel();
    this.props.handleSubmit(myform.assessmentName, myform.startDate, myform.endDate, 2, myform.doubleEntry, myform.type);
  }

  enableSubmitButton() {
    this.setState({
      canSubmit:true
    });
  }

  disableSubmitButton(){
    this.setState({
      canSubmit: false
    });
  }

  setStartDate() {
		var formatteddate = moment().format('YYYY-MM-DD');
		return formatteddate;
	}

	setEndDate() {
		return moment().add(1 ,'years').format('YYYY-MM-DD');
	}


  render() {

    var type=[
      {value: '1', label: 'Institution'},
      {value: '2', label: 'Class'},
      {value: '3', label: 'Student'}
    ];
    return (
      <Modal
        title='Create Assessment'
        contentLabel='Create Assessment'
        isOpen={this.props.isOpen}
        onCloseModal={this.props.onCloseModal}
        canSubmit={this.state.canSubmit}
        submitForm={this.submitForm}
        cancelBtnLabel='Cancel'
        submitBtnLabel='Create'
      >
        <Formsy.Form id="createAssessment" onValidSubmit={this.submitForm} onValid={this.enableSubmitButton} onInvalid={this.disableSubmitButton}
    disabled={this.state.disabled} ref={(ref) => this.myform = ref}>


         <Input name="assessmentName" id="assessmentName" value="" label="Name" type="text"
    placeholder="Please enter the assessment name" help="This is a required field" required validations="minLength:1"/>
          <Input type="date" label="Start Date" value={this.setStartDate()} name="startDate" help="Please select the start date of the assessment" required id="startDate"/>


          <Input type="date" label="End Date"  value={this.setEndDate()} help="Please select the end date of the assessment" required name="endDate"/>

          <RadioGroup
                  name="type"
                  type="inline"
                  label="Type"
                  help="Select the type of this assessment"
                  options={type}
                  required
              />


          <Checkbox label="Double Entry" name="doubleEntry" id="doubleEntry" help="Check this box if this assessment will need double entry"/>
        </Formsy.Form>
      </Modal>
    )
  }

}

