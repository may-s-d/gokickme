import { useState } from 'react';
import { aws } from '../AWS.js';
import { Button, Container, Table } from 'react-bootstrap';
import  { Navigate } from 'react-router-dom';
import Header from '../components/Header.js'

function SupporterHomepage() {
    const [projects, updateProjects] = useState()
    const [count, setCount] = useState(0);
    const supporterEmail = window.sessionStorage.getItem('supporterEmail')
    const [project, updateProject] = useState()
    const [supporter, updateSupporter] = useState()
    const [pledges, updatePledges] = useState()

    const checkBoxStyle = {
        margin: 1 + 'vw',
    }

    const getProjects = () => {
        aws.post('/adminProjects') //change this to something that excludes projects that failed :)!
        .then(response => {
            if (response.data.statusCode === 200) {
                const projects = response.data.body
                updateProjects(projects) // forces page refresh
            }
            else {
              console.log(response.data.body)
            }
        })
    }
    
    const getPledges = () => {
        const pledges = [];
        const promises = [];
        for (const pledge of supporter.pledges) {
            const body = {};
            body['projectName'] = pledge.project_name;
            body['id'] = pledge.id;
            const data = { 'body': JSON.stringify(body) }
            promises.push(aws.post('/viewPledge', data));
        }
        Promise.all(promises)
        .then(responses => {
            for (const response of responses) {
                if (response.data.statusCode === 200) {
                    const pledge = response.data.body;
                    pledges.push(pledge);
                }
                else {
                    console.log(response.data.body);
                }
            }
            updatePledges(pledges);
        })
    }
    

    const getSupporter = () => {
        const body = {};
        body['supporterEmail'] = supporterEmail;
        const data = { 'body': JSON.stringify(body) }   
        aws.post('/supporter', data)
        .then(response => {
            if (response.data.statusCode === 200) {
                const supporter = response.data.body
                updateSupporter(supporter)
            }
            else {
                console.log(response.data.body)
            }
        })
    }

    const attemptProjectView = (e) => {
        const projectName = e.currentTarget.parentNode.parentNode.id;
        window.sessionStorage.setItem("projectName", projectName);
        updateProject(projectName);
    }

    function sortProjectByDate(a, b) {
        if(a.deadline < b.deadline)
            return -1
        if(a.deadline > b.deadline)
            return 1
        return 0 
    }

    function calculateTimeLeft(deadline) {
        let today = Date.parse(new Date())
        let amongus = Date.parse(deadline)
        return Math.floor((amongus - today) / 86400000)
    }

    const renderProjects = () => {
        let filters = []

        let musicFilter = document.getElementById('music')
        let filmFilter = document.getElementById('film')
        let gameFilter = document.getElementById('game')

        if(musicFilter && musicFilter.checked)
        {
            filters.push("music")
        }

        if(filmFilter && filmFilter.checked) {
            filters.push("film")
        }

        if(gameFilter && gameFilter.checked)
        {
            filters.push("game")
        }

        console.log(filters)

        projects.sort(sortProjectByDate)
        const renderedProjects = projects.map((project, index) => {
            if(project.launched.data[0] === 1 && project.status !== 0 && (filters.includes(project.type) || filters.length === 0) && Date.parse(project.deadline) > Date.parse(new Date())) //thank you back end 
            {
                return (
                    <tr id={project.name} key={index}>
                        <td>{ project.name }</td>
                        <td>{ project.status }</td>
                        <td>{ project.type }</td>
                        <td>{ calculateTimeLeft(project.deadline) }</td>
                        <td><Button onClick={attemptProjectView}>View</Button></td>
                    </tr>
                )
            }
        })
        return (
            <Table>
                <thead>
                    <tr>
                        <th style={{width:'50%'}}>Project Name</th>
                        <th style={{width:'10%'}}>Status</th>
                        <th style={{width:'10%'}}>Type</th>
                        <th style = {{width: '20%'}}>Days Left</th>
                        <th style={{width:'10%'}}></th>
                    </tr>
                </thead>
                <tbody>
                    { renderedProjects }
                </tbody>
            </Table>
        )
    }

    const renderDonations = () => {
        if(supporter.donations.length === 0)
        {
            return (
                <>
                    <p>User has no active donations</p>
                </>
            )
        }
    }

    const renderActivePledges = () => {
        if(supporter.pledges.length === 0)
        {
            return (
                <>
                    <p>User has no active pledges</p>
                </>
            )
        } 
        else {
            const renderedPledges = supporter.pledges.map((pledge, index) => {
                console.log(pledge)
                return (
                    <tr id={pledge.project_name} key={index}>
                        <td>{ pledge.project_name }</td>
                        <td>{ pledge.pledge_id }</td>
                        <td>{ pledge.date.substring(0, 10) }</td>
                    </tr>
                )
            })

            return (
                <Table>
                    <thead>
                        <tr>
                            <th style={{width:'20%'}}>Project Name</th>
                            <th style={{width:'20%'}}>Pledge ID</th>
                            <th style={{width:'20%'}}>Date Claimed</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderedPledges }
                    </tbody>
                </Table>
            )
        }


    }

    if(typeof supporter === 'undefined') {
       return (
            <>
            <Header />
            <p>Loading Supporter Info...</p>
            {getSupporter()}
            </>
       )
    }

    if (typeof projects === 'undefined') { // projects not fetched yet
        return (
            <>
            <Header loggedIn={ true } />
            <p>Loading projects...</p>
            { getProjects() }
            </>
        )
    }

    if(typeof pledges === 'undefined') {
        return (
            <>
            <Header />
            <p>Loading Pledge Info...</p>
            {getPledges()}
            </>
        )
    }

    else if (typeof project !== 'undefined') { /* added project to sessionStorage, 
        continue to viewProject */
            return (
                <>
                    <Navigate 
                        to={'/viewProject'}
                    />
                </>
            )
        }

        else return (
            <>
            <Header loggedIn={ true } />

            <Container>
                <h1>Direct Donations</h1>
                { renderDonations() }
            </Container>

            <Container>
                <h1>Pledges Claimed</h1>
                { renderActivePledges() }
            </Container>

            <Container>
                <input style = {checkBoxStyle} type="checkbox" id="music" value="music" onChange={() => setCount(count + 1)}/>Music
                <input style = {checkBoxStyle} type="checkbox" id="film" value="film" onChange={() => setCount(count + 1)} />Film
                <input style = {checkBoxStyle} type="checkbox" id="game" value="game" onChange={() => setCount(count + 1)}/>Game
            </Container>

            <Container>
                <h1>Sitewide Active Projects</h1>
                { renderProjects() }
            </Container>
            </>
        )
}

export default SupporterHomepage;