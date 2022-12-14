import { useState } from 'react';
import { Button, Card, Container, Table } from 'react-bootstrap';
import  { Link } from 'react-router-dom';
import { aws } from '../AWS.js';
import Header from '../components/Header.js';
import PledgeList from '../components/PledgeList.js';

function ViewProject() {
    const projectName = window.sessionStorage.getItem('projectName');
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    const supporterEmail = window.sessionStorage.getItem('supporterEmail');

    const [project, updateProject] = useState();
    let isLaunched = false;

    const getProject = () => {
        const body = {};
        if (designerEmail) {
            body['designerEmail'] = designerEmail;
        }
        else if (supporterEmail) {
            body['supporterEmail'] = supporterEmail;
        }
        body['projectName'] = projectName;
        const data = { 'body': JSON.stringify(body) }
        console.log(data);
        aws.post('/viewProject', data)
        .then(response => {
            if (response.data.statusCode === 200) {
                const project = response.data.body;
                console.log(project);
                updateProject(project);
            }
            else {
              console.log(response.data.body);
            }
        })
    }

    function getFunding(funding) {
        if(funding == null) {
            return '0'
        }
        else {
            return funding
        }
    }

    const renderProject = () => {
        return (
            <Container id={project.name}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <Card style={{ width: '60%' }}>
                            <Card.Body>
                            <Card.Title>Project name: {project.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Designer: {project.designer_name}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Type: {project.type}</Card.Subtitle>
                            <Card.Text>Story: {project.story}</Card.Text>
                            </Card.Body>
                        </Card>
                    <Card style={{ width: '40%' }}>
                        <Card.Body>
                            <Card.Text>${getFunding(project.totalFunded)} raised out of  ${project.goal_amount} goal</Card.Text>
                            <Card.Text>Deadline: {project.deadline}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        )
    }
    
    if (typeof project === 'undefined') {
        return (
            <>
            <Header loggedIn={ true } />
            <p>Loading project...</p>
            { getProject() }
            </>
        )
    }

    else {
        isLaunched = project.launched.data[0] !== 0;
        
        const attemptLaunchProject = () => {
            const body = {};
            body['designerEmail'] = designerEmail;
            body['projectName'] = projectName;
            const data = { 'body': JSON.stringify(body) }
            aws.post('/launchProject', data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    getProject();
                }
                else {
                  console.log(response.data.body);
                }
            })
            .catch(console.log);
        }

        const launchButton = !isLaunched ? 
            <Button onClick={attemptLaunchProject}>Launch</Button> : 
            <></>;
        
        const createPledgeButton = !isLaunched ?
            <Button 
            as={ Link }
            to='/createPledge'
            variant='outline-success'
            style={{justifySelf:'stretch'}}>
                Create new pledge
            </Button> :
            <></>;
        
        const directDonationButton = supporterEmail && (project.status === 'incomplete') ?
            <Button 
            as={ Link } 
            to='/directDonation'>
                Make a direct donation
            </Button> :
            <></>;

        const renderedDonations = project.donations.map((donation, index) => {
            return (
                <tr id={donation.date} key={index}>
                    <td>{ donation.supporter_email }</td>
                    <td>{ '$' + donation.cost }</td>
                </tr>
            )
        })
            

        return (
            <>
            <Header loggedIn={ true } />
            <Container>
                <div>
                    <Button 
                    as={ Link }
                    to='/'
                    variant='outline-primary'>
                        {"← Back to Projects"}
                    </Button>
                    { launchButton }
                    { directDonationButton }
                </div>
                
                    
                { renderProject() }
                <Container>
                    <Card>
                        <Card.Header style={{display:'grid'}}>
                            <h5 style={{justifySelf:'center'}}>Pledges</h5>
                            { createPledgeButton }
                        </Card.Header>
                        <Card.Body>
                            <PledgeList project={project} />
                        </Card.Body>
                    </Card>
                </Container>
                <h1>Direct Donations</h1>
                <Table>
                <thead>
                        <tr>
                            <th style={{width:'20%'}}>Supporter</th>
                            <th style={{width:'20%'}}>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderedDonations }
                    </tbody>
                </Table>
            </Container>
            </>
        );
    }
  }

export default ViewProject