import React from 'react';
import {modifyBoundary, deleteBoundary, saveNewCluster, fetchEntitiesFromServer, getBoundaries,openNode} from '../actions';
import Button from './Button'
import CreateCluster from './Modals/CreateBoundary'
import ConfirmModal from './Modals/Confirm'
import { Link } from 'react-router'
import FRC from 'formsy-react-components';
import Formsy from 'formsy-react';
const { Input} = FRC;

export default class PrimaryDistrict extends React.Component {

  constructor(props){
    super(props);
    this.onClickSaveBlock = this.onClickSaveBlock.bind(this);
    this.onClickDeleteBlock = this.onClickDeleteBlock.bind(this);
    this.toggleClusterModal = this.toggleClusterModal.bind(this);
    this.saveCluster = this.saveCluster.bind(this);
    this.hasChildren = this.hasChildren.bind(this);

    this.state = {
      value: '',
      clusterModalIsOpen: false,
      openConfirmModal: false,
      canSubmit: false,
      isLoading: true
    };
  }

  componentDidMount() {
    const {params,dispatch} = this.props
    dispatch(openNode(params.districtId))
    dispatch(fetchEntitiesFromServer(params.districtId));
    dispatch({
      type: 'BOUNDARIES',
      payload: getBoundaries(1)
    }).then(() => {
      dispatch({
        type: 'BOUNDARIES',
        payload: getBoundaries(params.districtId)
      }).then(() => {
        this.setState({
          isLoading:false
        })
        dispatch(openNode(params.blockId))
        dispatch(fetchEntitiesFromServer(params.blockId));
      })
    })

  }

  closeConfirmation = () => {
    this.setState({
      openConfirmModal: false
    })
  }

  showConfirmation = () => {
    this.setState({
      openConfirmModal: true
    })
  }

  onClickSaveBlock() {
    var myform = this.myform.getModel();
    this.props.dispatch(modifyBoundary(this.props.params.blockId, myform.BlockName));
  }

  saveCluster(name) {
    const options = {
      name,
      parent: this.props.params.blockId,
      boundary_type: 1,
      boundary_category: 11
    }
    this.props.dispatch(saveNewCluster(options))
  }

  toggleClusterModal(){
    this.props.dispatch({
      type: 'TOGGLE_MODAL',
      modal: 'createCluster'
    })
  }

  onClickDeleteBlock() {
    let {params} = this.props
    this.props.dispatch(deleteBoundary(params.blockId, params.districtId));
  }

  enableSubmitButton=()=> {
    this.setState({
      canSubmit: true,
    });
  }

  disableSubmitButton=()=> {
    this.setState({
      canSubmit: false,
    });
  }

   hasChildren() {
    if(this.props.boundariesByParentId[this.props.params.blockId]) {
      return this.props.boundariesByParentId[this.props.params.blockId].length > 0;
    }
    else
      return false;
}

Displayelement=(props)=>{
  var block = this.props.boundaries.boundaryDetails[this.props.params.blockId];
  var district = this.props.boundaries.boundaryDetails[this.props.params.districtId];
   let hasClusters = this.hasChildren();
  if(sessionStorage.getItem('isAdmin')) {
    return(
        <div>
        {hasClusters?<p className="col-md-12 bg-info"><h5><i className="fa fa-2x fa-info-circle" aria-hidden="true"></i>You cannot <small>delete this block until the clusters below it are deleted</small></h5></p>:<div></div>}

        <div className='heading-border-left'>
        <h4 className="brand-blue col-md-10">Modify Details</h4>
        <Button onClick={this.toggleClusterModal} title='Add Cluster'/>
        </div>
        <Formsy.Form
         onValidSubmit={this.onClickSaveBlock}
         onValid={this.enableSubmitButton}
         onInvalid={this.disableSubmitButton}
         ref={(ref) => this.myform = ref}
         >
         <Input name="BlockName"
          id="BlockName"
          value={block.name}
          label="Block :" type="text"
           placeholder="Please enter the block name"
           className="form-control"
           required validations="minLength:1"/>
       </Formsy.Form>
        <div className="col-md-8">
        <button type="submit" disabled={!this.state.canSubmit} className="btn btn-primary padded-btn" onClick={this.onClickSaveBlock}>Save</button>
        <button type="submit" className="btn btn-primary padded-btn" disabled={hasClusters} onClick={() => {this.showConfirmation()}}>Delete</button>
        <ConfirmModal isOpen={this.state.openConfirmModal} onAgree={this.onClickDeleteBlock} onCloseModal={this.closeConfirmation} entity={block.name}/>
        </div>
        </div>
    )
  }
  else{
    return(
          <div>
          <h4 className="heading-err heading-border-left brand-red"> <span className="fa-stack fa-lg"> <i className="fa fa-circle fa-stack-2x brand-red"></i>
            <i className="fa fa-lock fa-stack-1x fa-inverse"></i></span>  Insufficient Permissions</h4>
          <p>You need administrator privileges to modify Boundary details.</p>
          <h4 className="brand-blue heading-border-left"> Block Details</h4>
          <p> Name: {block.name}</p>
        </div>
  )
  }
}
  render() {
    var block = this.props.boundaries.boundaryDetails[this.props.params.blockId];
    var district = this.props.boundaries.boundaryDetails[this.props.params.districtId];

    return (
      this.state.isLoading ?
      <div>Loading...</div> :
      <div>
      <ol className="breadcrumb">
      <li><Link to={district.path}>{district.name}</Link></li>
      <li className="active">{block.name}</li>
      </ol>
      {this.Displayelement(...this.props)}

      <CreateCluster placeHolder='Cluster Name' title='Create New Cluster' isOpen={this.props.modal.createCluster} onCloseModal={this.toggleClusterModal} save={ this.saveCluster } />
      </div>
      );
  };
}
