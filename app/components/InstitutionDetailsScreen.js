import React from 'react';
import ConfirmModal from './Modals/Confirm'
import {deleteInstitution, saveInstitution, saveNewClass, getBoundaries, getInstitutions} from '../actions'
import Button from './Button'
import CreateClass from './Modals/CreateClass'
import {mapValues} from 'lodash';
import { Link } from 'react-router';
import Select from 'react-select';
import {getManagement, getLanguages, getInstitutionCategories, replaceNull, userHasPermissions} from './utils'

export default class Institution extends React.Component {

  constructor (props){
    super(props);
    this.state = {
      openConfirmModal: false,
      institution: this.props.boundaries.boundaryDetails[this.props.params.institutionId],
      languages: {
        isLoading:true,
        list:[]
      },
      mgmt: {
        isLoading: true,
        list:[]
      },
      institutionCategories: {
        isLoading: true,
        list:[]
      },
      isLoading: true
    };
    this.saveInsti = this.saveInsti.bind(this)
    this.saveClass = this.saveClass.bind(this)
    this.toggleClassModal = this.toggleClassModal.bind(this)
    this.deleteInstitution = this.deleteInstitution.bind(this);
    this.hasPermissions = this.hasPermissions.bind(this);

  }

  componentDidMount() {
    const {params, dispatch} = this.props
    getLanguages().then((languages) => {
      const langs = languages.results.map((language) => ({
        value: language.id,
        label: language.name
      }))
      this.setState({
        languages: {
          isLoading: false,
          list: langs
        }
      })
    })

    getManagement().then((managements) => {
      const mgmt = managements.results.map((management) => ({
        value: management.id,
        label: management.name
      }))

      this.setState({
        mgmt: {
          isLoading: false,
          list: mgmt
        }
      })
    })

    getInstitutionCategories().then((categories) => {

      const cat = categories.results.filter((cat => {
        return cat.category_type == 1
      })).map((category) => ({
        value: category.id,
        label: category.name
      }))


      this.setState({
        institutionCategories: {
          isLoading: false,
          list: cat
        }
      })
    })

    dispatch({
      type: 'BOUNDARIES',
      payload: getBoundaries(1)
    }).then(() =>
    dispatch({
      type: 'BOUNDARIES',
      payload: getBoundaries(params.districtId)
    })).then(() =>
    dispatch({
      type: 'BOUNDARIES',
      payload: getBoundaries(params.blockId)
    })).then(() =>
    dispatch({
      type: 'BOUNDARIES',
      payload: getInstitutions(params.clusterId)
    })).then(() => {
    this.setState({
      isLoading:false
    })})
  }

    componentWillReceiveProps(props) {
      let institution =  props.boundaries.boundaryDetails[props.params.institutionId]
      institution = replaceNull(props.boundaries.boundaryDetails[props.params.institutionId])
      this.setState({
        institution
      })
    }

    saveInsti() {
      const institution = {
        ...this.state.institution,
        id: this.props.params.institutionId
      }


      this.props.dispatch(saveInstitution(institution))
    }

    toggleClassModal() {
     this.props.dispatch({
      type: 'TOGGLE_MODAL',
      modal: 'createClass'
    })
   }

   saveClass(name,section,type) {
     const institution = this.props.params.institutionId
     const options = {
      name,
      institution,
      section,
      type
    }
    this.props.dispatch(saveNewClass(options))
  }

  selectEntity(key, val) {
    const state = {}
    state[key] = val
    this.setState(state)
  }

  showConfirmation = () => {
    this.setState({
      openConfirmModal: true
    })
  }

  closeConfirmModal = () => {
    this.setState({
      openConfirmModal: false
    })
  }

  setValue(val, key) {
    this.setState((state, props) => {
      const copy = Object.assign({}, state)
      copy.institution[key] = val
      return copy
    })
  }

  deleteInstitution() {
    this.props.dispatch(deleteInstitution(Number(this.props.params.clusterId), Number(this.props.params.institutionId)))
  }

  hasPermissions() {
   
    return userHasPermissions(this.props.permissions,this.props.params.institutionId);
  }

  render() {

  	var block = this.props.boundaries.boundaryDetails[this.props.params.blockId];
    var district = this.props.boundaries.boundaryDetails[this.props.params.districtId];
    var cluster = this.props.boundaries.boundaryDetails[this.props.params.clusterId];
    var institution = this.state.institution
    let canModify = sessionStorage.getItem('isAdmin') || this.hasPermissions();
    var Displayelement = (props) =>
        <div>
        <ol className="breadcrumb">
        <li><Link to={district.path}>{district.name}</Link></li>
        <li> <Link to={block.path}> {block.name}</Link></li>
        <li> <Link to={cluster.path}> {cluster.name}</Link></li>
        <li className="active"> {institution.name}</li>
        </ol>
        <div>
          {!canModify?<div>
            <span className="fa-stack fa-lg"> <i className="fa fa-circle fa-stack-2x brand-red"></i>
            <i className="fa fa-lock fa-stack-1x fa-inverse"></i></span><h4 className="heading-border-left brand-red">Limited Permissions</h4>
            <div className="col-md-12">You need administrator privileges or permissions to modify this institution</div>
           
          </div>:<div></div>}
        <h4 className="heading-border-left brand-blue col-md-10">{canModify? "Modify Details": "View Details"}</h4>
        {!canModify?null:<Button onClick={this.toggleClassModal} title='Add Class'disabled={!canModify}/>}
        
        <form className="form-horizontal col-md-8" role="form">
        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="name">Name:</label>
        <div className="col-sm-10">
        <input type="text" disabled={!canModify} onChange={(e) => {this.setValue(e.target.value, 'name')}} className="form-control" id="name" value={institution.name}/>
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="address">Address:</label>
        <div className="col-sm-10">
        <textarea disabled={!canModify} onChange={(e) => {this.setValue(e.target.value, 'address')}} className="form-control" id="address" rows="3" value={institution.address}>
        </textarea>
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="area">Area:</label>
        <div className="col-sm-10">
        <input disabled={!canModify} id="area" onChange={(e) => {this.setValue(e.target.value, 'area')}} type="text" className="form-control" value={institution.area}/>
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="landmark">Landmark:</label>
        <div className="col-sm-10">
        <input disabled={!canModify} onChange={(e) => {this.setValue(e.target.value, 'landmark')}} type="text" className="form-control" id="landmark" value={institution.landmark}/>
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="pincode">Pincode:</label>
        <div className="col-sm-10">
        <input disabled={!canModify} onChange={(e) => {this.setValue(e.target.value, 'pincode')}} type="text" className="form-control" id="pincode" value={institution.pincode}/>
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="category">Category:</label>
        <div className="col-sm-10">
        <Select disabled={!canModify} name="form-field-name" value={institution.cat} options={this.state.institutionCategories.list} onChange={(val) => {this.setValue(val.value, 'cat')}} />
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="medium">Medium:</label>
        <div className="col-sm-10">
        <Select disabled={!canModify} multi name="languages" value={institution.languages} options={this.state.languages.list} onChange={(val) => {this.setValue(val.map(v => v.value), 'languages')}}/>
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="gender">Gender:</label>
        <div className="col-sm-10">
        <select disabled={!canModify} onChange={(e) => {this.setValue(e.target.value, 'institution_gender')}} value={institution.institution_gender} className="form-control" id="gender">
        <option value='co-ed'>Co-Ed</option>
        <option value='boys'>Boys</option>
        <option value='girls'>Girls</option>
        </select>
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="mgmt">Management:</label>
        <div className="col-sm-10">
        <Select disabled={!canModify} name="form-field-name" value={institution.mgmt} options={this.state.mgmt.list} onChange={(val) => {this.setValue(val.value, 'mgmt')}} />
        </div>
        </div>

        <div className="form-group">
        <label className="control-label col-sm-2" htmlFor="disecode">DISE Code:</label>
        <div className="col-sm-10">
        <input disabled={!canModify} onChange={(e) => {this.setValue(e.target.value, 'dise_code')}} type="text" className="form-control" id="disecode" value={institution.dise_code}/>
        </div>
        </div>
        </form>
        {!canModify?<div></div>:
        <div className="col-md-2">
        <button type="submit" className="btn btn-primary" onClick={this.saveInsti}>Save</button>
        <button type="submit" className="btn btn-primary" onClick={this.showConfirmation}>Delete</button>
        <ConfirmModal isOpen={this.state.openConfirmModal} onAgree={this.deleteInstitution} onCloseModal={this.closeConfirmModal} entity={institution.name}/>
        </div>}
        </div>
        <CreateClass placeHolder='Class Name' title='Create New Class' isOpen={this.props.modal.createClass} onCloseModal={this.toggleClassModal} save={ this.saveClass } />
        </div>
    //End of DisplayElement

return (
      this.state.isLoading ?
      <div>Loading...</div> :
      <Displayelement {...this.props}/>
    )

};
}


