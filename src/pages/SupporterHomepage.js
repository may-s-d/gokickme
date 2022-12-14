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
    const [donations, updateDonations] = useState()

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
            body['id'] = pledge.pledge_id;
            const data = { 'body': JSON.stringify(body) }
            promises.push(aws.post('/viewPledge', data));
            setTimeout(function() {
              }, 100);
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
                
                console.log(supporter)
                const donations = []
                for(let donation of supporter.donations) {
                    donations.push(donation)
                }
                updateDonations(donations)
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
        let textSearch = document.getElementById('search')

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

        projects.sort(sortProjectByDate)
        const renderedProjects = projects.map((project, index) => {
            const isLaunched = project.launched.data[0] === 1;
            const hasFailed = project.status === 'failed';
            const inFilters = filters.length === 0 || filters.includes(project.type);
            if (isLaunched && !hasFailed && inFilters) {
                const hasSearchInput = textSearch && textSearch.value !== 'search' && textSearch.value !== '';
                if (!hasSearchInput || project.name.toLowerCase().includes(textSearch.value) || project.story.toLowerCase().includes(textSearch.value)) {
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
            }
        })
        return (
            <Table>
                <thead>
                    <tr>
                        <th style={{width:'50%'}}>Project Name</th>
                        <th style={{width:'10%'}}>Status</th>
                        <th style={{width:'10%'}}>Type</th>
                        <th style={{width:'20%'}}>Days Left</th>
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
        if(donations.length === 0)
        {
            return (
                <>
                    <p>User has no active donations</p>
                </>
            )
        }
        else {
            const renderedDonations = donations.map((donation, index) => {
                if(donation.project_status[0].status !== 'failed')
                return (
                    <tr id={donation.project_name} key={index}>
                        <td>{ donation.project_name }</td>
                        <td>{ '$' + donation.cost }</td>
                        <td>{ donation.date.substring(0, 10) }</td>
                    </tr>
                )
            })
            return (
                <Table>
                    <thead>
                        <tr>
                            <th style={{width:'20%'}}>Project Name</th>
                            <th style={{width:'20%'}}>Donation Amount</th>
                            <th style={{width:'20%'}}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderedDonations }
                    </tbody>
                </Table>
            )
        }
    }

    const renderActivePledges = () => {
        if(pledges.length === 0)
        {
            return (
                <>
                    <p>User has no active pledges</p>
                </>
            )
        } 
        else {
            const renderedPledges = pledges.map((pledge, index) => {
                if(pledge.projectStatus === 'incomplete') {
                return (
                    <tr id={pledge.project_name} key={index}>
                        <td>{ pledge.project_name }</td>
                        <td>{ pledge.description }</td>
                        <td>{ pledge.projectStatus }</td>
                        <td>{ '$' + pledge.cost }</td>
                    </tr>
                )
                }
            })

            const renderedSuccessfulPledges = pledges.map((pledge, index) => {
                if(pledge.projectStatus === 'successful') {
                    return (
                    <tr id={pledge.project_name} key={index}>
                        <td>{ pledge.project_name }</td>
                        <td>{ pledge.description }</td>
                        <td>{ pledge.projectStatus }</td>
                        <td>{ '$' + pledge.cost }</td>
                    </tr>
                )
                    }
            })

            return [
                <h2>Active Pledges</h2>,
                <Table>
                    <thead>
                        <tr>
                            <th style={{width:'20%'}}>Project Name</th>
                            <th style={{width:'20%'}}>Pledge Description</th>
                            <th style={{width:'20%'}}>Project Status</th>
                            <th style={{width:'20%'}}>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderedPledges }
                    </tbody>
                </Table>,
                <h2>Successful Pledges</h2>,
                <Table>
                    <thead>
                        <tr>
                            <th style={{width:'20%'}}>Project Name</th>
                            <th style={{width:'20%'}}>Pledge Description</th>
                            <th style={{width:'20%'}}>Project Status</th>
                            <th style={{width:'20%'}}>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedSuccessfulPledges}
                    </tbody>
                </Table>
            ]
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
            {getProjects()}
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
                <h2>Filter Results</h2>
                <input style = {checkBoxStyle} type="checkbox" id="music" value="music" onChange={() => setCount(count + 1)}/>Music
                <input style = {checkBoxStyle} type="checkbox" id="film" value="film" onChange={() => setCount(count + 1)} />Film
                <input style = {checkBoxStyle} type="checkbox" id="game" value="game" onChange={() => setCount(count + 1)}/>Game
                <input style = {checkBoxStyle} type="text" id="search" defaultValue="search" onClick={(e) => {
                    e.target.value = ''
                }} onChange={() => setCount(count + 1)}/>
            </Container>

            <Container>
                <h1>Sitewide Active Projects</h1>
                { renderProjects() }
            </Container>
            </>
        )
}

export default SupporterHomepage;