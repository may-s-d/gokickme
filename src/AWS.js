import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
// all WEB traffic using this API instance
export const aws = axios.create({
   baseURL: 'https://xwt44qrls7.execute-api.us-east-2.amazonaws.com/Stage',
});

// const mockAws = new AxiosMockAdapter(aws, { delayResponse: 0 });

// mockAws.onPost('/registerDesigner')
// .reply(200, { 
// body: {
//    designer: {
//       email: 'email',
//       name: 'name',
//       projects: [] 
//    }
// }
// });

// mockAws.onPost('/login')
// .reply(200, { 
// body: {
//   designer: {
//       email: 'loginemail',
//       name: 'name',
//       projects: [
//         {
//           'projectName': 'projectName',
//           'story': 'this is the story!',
//           'designer': 'George Heineman',
//           'type': 'type',
//           'goalAmount': 1000.00,
//           'deadline': '2012-04-23T18:25:43.511Z',
//           'totalFunded': 500.00,
//           'pledges': [
//                           {
//                               'cost': 10.00,
//                               'description': '',
//                               'maxSupporters': 10,
//                               'supporters': []
//                           },
//                           {
//                               'cost': 25.00,
//                               'description': 'fun tier :)',
//                               'maxSupporters': 5,
//                               'supporters': []
//                           }
//                       ],
//           'launched': false,
//           'status': 0
//         }, 
//         {
//           'projectName': 'MySecondProject',
//           'story': 'This one will not fail!',
//           'designer': 'Alex Pietrick',
//           'type': 'Video Game',
//           'goalAmount': 1234.55,
//           'deadline': '2092-01-22T8:58:12.467Z',
//           'totalFunded': 2831.22,
//           'pledges':    [
//                           {
//                               'cost': 420.69,
//                               'description': 'Epic Time with This Pledge!',
//                               'maxSupporters': 69,
//                               'supporters': []
//                           }],
//           'launched': false,
//           'status': 'successful'
//         }
//       ] 
//   }
// }
// });

// mockAws.onPost('/createPledge')
// .reply(200, {
// body: {
//     'cost': 10.00,
//     'description': '',
//     'maxSupporters': 10,
//     'supporters': []
// }
// })

// mockAws.onPost('/createProject')
// .reply(200, { 
// body: {
//   designer: {
//       email: 'loginemail',
//       name: 'name',
//       projects: [
//         {
//           'projectName': 'projectName',
//           'story': 'this is the story!',
//           'designer': 'egg',
//           'type': 'type',
//           'goalAmount': 1000.00,
//           'deadline': '2012-04-23T18:25:43.511Z',
//           'totalFunded': 500.00,
//           'pledges': [
//                           {
//                               'cost': 10.00,
//                               'description': '',
//                               'maxSupporters': 10,
//                               'supporters': []
//                           },
//                           {
//                               'cost': 25.00,
//                               'description': 'fun tier :)',
//                               'maxSupporters': 5,
//                               'supporters': []
//                           }
//                       ],
//           'launched': false,
//           'status': 0
//         }, 
//         {
//           'projectName': 'MySecondProject',
//           'story': 'This one will not fail!',
//           'designer': 'egg',
//           'type': 'Video Game',
//           'goalAmount': 1234.55,
//           'deadline': '2092-01-22T8:58:12.467Z',
//           'totalFunded': 2831.22,
//           'pledges':    [
//                           {
//                               'cost': 420.69,
//                               'description': 'Epic Time with This Pledge!',
//                               'maxSupporters': 69,
//                               'supporters': []
//                           }],
//           'launched': false,
//           'status': 'successful'
//         },
//         {
//           'projectName': 'thirdproject',
//           'story': 'get mocked, idiot',
//           'designer': 'egg',
//           'type': 'Video Game',
//           'goalAmount': 1234.55,
//           'deadline': '2092-01-22T8:58:12.467Z',
//           'totalFunded': 2831.22,
//           'pledges':    [
//                           {
//                               'cost': 420.69,
//                               'description': 'Epic Time with This Pledge!',
//                               'maxSupporters': 69,
//                               'supporters': []
//                           }],
//           'launched': false,
//           'status': 'successful'
//         },
//       ] 
//   }
// }
// });

// mockAws.onGet('/adminProjects')
// .reply(200, { 
// body: {
//    projects: [
//       {
//       'projectName': 'projectName',
//       'story': 'this is the story!',
//       'designer': 'egg',
//       'type': 'type',
//       'goalAmount': 1000.00,
//       'deadline': '2012-04-23T18:25:43.511Z',
//       'totalFunded': 500.00,
//       'pledges': [
//                         {
//                            'cost': 10.00,
//                            'description': '',
//                            'maxSupporters': 10,
//                            'supporters': []
//                         },
//                         {
//                            'cost': 25.00,
//                            'description': 'fun tier :)',
//                            'maxSupporters': 5,
//                            'supporters': []
//                         }
//                   ],
//       'launched': false,
//       'status': 0
//       }, 
//       {
//       'projectName': 'MySecondProject',
//       'story': 'This one will not fail!',
//       'designer': 'egg',
//       'type': 'Video Game',
//       'goalAmount': 1234.55,
//       'deadline': '2092-01-22T8:58:12.467Z',
//       'totalFunded': 2831.22,
//       'pledges':    [
//                         {
//                            'cost': 420.69,
//                            'description': 'Epic Time with This Pledge!',
//                            'maxSupporters': 69,
//                            'supporters': []
//                         }],
//       'launched': false,
//       'status': 'successful'
//       },
//       {
//       'projectName': 'thirdproject',
//       'story': 'get mocked, idiot',
//       'designer': 'egg',
//       'type': 'Video Game',
//       'goalAmount': 1234.55,
//       'deadline': '2092-01-22T8:58:12.467Z',
//       'totalFunded': 2831.22,
//       'pledges':    [
//                         {
//                            'cost': 420.69,
//                            'description': 'Epic Time with This Pledge!',
//                            'maxSupporters': 69,
//                            'supporters': []
//                         }],
//       'launched': false,
//       'status': 'successful'
//       },
//    ]
// }
// });

// mockAws.onGet('/viewProject')
// .reply(200, {
//   body: {
//     project: {
//       'projectName': 'projectName',
//         'story': 'this is the story!',
//         'designer': 'egg',
//         'type': 'type',
//         'goalAmount': 1000.00,
//         'deadline': '2012-04-23T18:25:43.511Z',
//         'totalFunded': 500.00,
//         'pledges': [
//                         {
//                             'cost': 10.00,
//                             'description': '',
//                             'maxSupporters': 10,
//                             'supporters': []
//                         },
//                         {
//                             'cost': 25.00,
//                             'description': 'fun tier :)',
//                             'maxSupporters': 5,
//                             'supporters': []
//                         }
//                     ],
//         'launched': false,
//         'status': 0
//     }
//   }
// })

// mockAws.onPost('/designerProjects')
// .reply(200, { 
//   body: {
//     projects: [
//       {
//         'projectName': 'projectName',
//         'story': 'this is the story!',
//         'designer': 'egg',
//         'type': 'type',
//         'goalAmount': 1000.00,
//         'deadline': '2012-04-23T18:25:43.511Z',
//         'totalFunded': 500.00,
//         'pledges': [
//                         {
//                             'cost': 10.00,
//                             'description': '',
//                             'maxSupporters': 10,
//                             'supporters': []
//                         },
//                         {
//                             'cost': 25.00,
//                             'description': 'fun tier :)',
//                             'maxSupporters': 5,
//                             'supporters': []
//                         }
//                     ],
//         'launched': false,
//         'status': 0
//       }, 
//       {
//         'projectName': 'MySecondProject',
//         'story': 'This one will not fail!',
//         'designer': 'egg',
//         'type': 'Video Game',
//         'goalAmount': 1234.55,
//         'deadline': '2092-01-22T8:58:12.467Z',
//         'totalFunded': 2831.22,
//         'pledges':    [
//                         {
//                             'cost': 420.69,
//                             'description': 'Epic Time with This Pledge!',
//                             'maxSupporters': 69,
//                             'supporters': []
//                         }],
//         'launched': false,
//         'status': 'successful'
//       },
//       {
//         'projectName': 'thirdproject',
//         'story': 'get mocked, idiot',
//         'designer': 'egg',
//         'type': 'Video Game',
//         'goalAmount': 1234.55,
//         'deadline': '2092-01-22T8:58:12.467Z',
//         'totalFunded': 2831.22,
//         'pledges':    [
//                         {
//                             'cost': 420.69,
//                             'description': 'Epic Time with This Pledge!',
//                             'maxSupporters': 69,
//                             'supporters': []
//                         }],
//         'launched': false,
//         'status': 'successful'
//       },
//     ]
//   }
//  });