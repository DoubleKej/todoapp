import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listToDo: [],
      currentId: '',
      currentName:'',
      open: false,
      checked: false,
      valueEdit:''
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEdit = this.handleChangeEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  getList() {
    axios.get('http://localhost:8000/todos', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then((response) => {
        console.log('hihi', response);
        this.setState({
          listToDo: response.data.data
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  componentDidMount() {
    console.log("xxx")
    this.getList();
    // axios.get('http://localhost:8000/todos', {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   }
    // })
    //   .then((response) => {
    //     console.log('hihi', response);
    //     this.setState({
    //       listToDo: response.data.data,
    //     })
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleChangeEdit(event){
    this.setState({valueEdit: event.target.value});
  }

  handleSubmit(event) {
    console.log(this.state.value)
    axios('http://localhost:8000/add', {
      method: 'POST',
      data: JSON.stringify({
        name: this.state.value
      }),
      headers: {
        // 'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      this.getList();
      console.log(response);
    })
      .catch(function (error) {
        console.log(error);
      });


    event.preventDefault();
  }
  handleEdit(_id) {
    console.log('edit ID', _id)
    console.log('edit content', this.state.valueEdit)
    axios(`http://localhost:8000/edit/${_id}`, {
      method: 'PUT',
      data: JSON.stringify({
        name: this.state.valueEdit
      }),
      headers: {
        // 'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      this.getList();
      console.log(response);
      this.setState({open: false});
    })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleChangeBox = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  handleCheck(_id) {
    console.log('edit ID', _id)
    axios(`http://localhost:8000/check/${_id}`, {
      method: 'PUT',
      data: {
          status: this.state.checked

      }
      ,
      headers: {
        // 'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      this.getList();
      console.log(response);
    })
      .catch(function (error) {
        console.log(error);
      });
  }


  handleClick(_id) {
    console.log('clicked ', _id);
    this.setState({
      currentId: _id,
    })
  }
  handleDelete(_id) {
    console.log(_id)
    axios.delete(`http://localhost:8000/${_id}`)
      .then(res => {
        this.getList();
        console.log(res)
        console.log('it works')
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };


  render() {
    const { classes } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <div className="static-modal">
          </div>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Todo React App</h1>
        </header>
        <div id="todo-table">
          <form action="" onSubmit={this.handleSubmit}>
            <Input type="text" name="item" value={this.state.value} onChange={this.handleChange} placeholder="Add a new task..." required></Input>
            <IconButton variant="raised" color="primary" type="submit"><AddIcon/></IconButton>

          </form>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Checked</TableCell>
                {/* <TableCell>ID</TableCell> */}
                <TableCell>TaskName</TableCell>
                {/* <TableCell>Status</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.state.listToDo.map(todo =>
                  
                  <TableRow style={{ backgroundColor: `${todo._id === this.state.currentId ? ('blue') : ('white')}` }} onClick={() => this.handleClick(todo._id)}>
                    
                    <TableCell padding="checkbox">
                      {/* todo.status === true ? (`${this.setState({checked: true})}`) : (`${this.setState({checked: false})}`) */}
                      <Checkbox                   
                        value="checked"
                        onClick={() => {this.handleCheck(todo._id) }}
                        onChange={this.handleChangeBox('checked')}
                        checked={todo.status}
                        
                      />
                    </TableCell>
                    {/* <TableCell>{todo._id}</TableCell> */}
                    <TableCell>{todo.name}</TableCell>
                    {/* <TableCell>
                      {
                        
                        // // todo.status === true ? (`${1}`) : (`${2}`)
                        todo.status === true && (`${1}`)
                      }
                    </TableCell> */}
                    <TableCell>
                      <IconButton onClick={() => { this.handleOpen()}}><EditIcon/></IconButton>

                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => { this.handleDelete(todo._id) }}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Edit Dialog</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Lorem ipsum...
            </DialogContentText>
              <TextField
                valueEdit={this.state.valueEdit}
                onChange={this.handleChangeEdit}
                autoFocus
                margin="dense"
                id="name"
                label="Edit this task"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
            </Button>
              <Button onClick={() => { this.handleEdit(this.state.currentId)}} color="primary">
                Subscribe
            </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}


export default App;
