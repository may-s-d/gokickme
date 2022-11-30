import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js'

const projectName = window.sessionStorage.getItem("projectName")

function ViewProject() {
    console.log(projectName)
}


export default ViewProject