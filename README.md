# Deploy WhereNow? - Vacation Search Web Application using CircleCI CI/CD Pipeline

## Deployment Dashboards

- **Heroku Dashboard**: [View Application](https://dashboard.heroku.com/apps/sleepy-dusk-19083)
- **CircleCI Dashboard**: [View Pipeline](https://app.circleci.com/pipelines/github/ahmadchaabane26/WhereNow)

## Project Description

WhereNow? is a travel search engine designed to help users discover destinations, accommodations, and activities tailored to their preferences. While the initial scope included implementing personalized travel itineraries, this version focuses on essential features, including saving and adding destinations, alongside user authentication.

### Key Features:

- Dynamic user interface with real-time updates as users refine their search.
- User login and logout functionality with authentication for secure access.
- Save and add destinations to user profiles.
- Aggregation of data from various travel APIs for hotels, flights, and activities.
- CI/CD automation for seamless updates using GitHub, CircleCI, and Heroku.

The project leverages Firebase for backend services and data storage.

- **Front-end**: React.js
- **Back-end**: Node.js and Express.js
- **Database**: Firebase Firestore

### Integrated APIs:

- **Hotel Search**: [Amadeus Hotel Search API](https://developers.amadeus.com/)
- **Flight Search**: [API Ninja](https://api-ninjas.com/)
- **Activities Search**: [Geoapify API](https://www.geoapify.com/)
- **Cities Search**: [Api Ninja](https://api.api-ninjas.com/v1/city)

## Team Members

- Ahmad Chaabane
- Christopher Cajamarca
- Caleb Riggs
- Kevin Pulickal
- Douglas Chi

## Tools and Technologies

| Tool Type          | Tool               |
| ------------------ | ------------------ |
| **Source Control** | GitHub             |
| **Build and Test** | CircleCI           |
| **Deployment**     | Heroku             |
| **Programming**    | Node.js            |
| **Database**       | Firebase Firestore |

### Tool Justifications:

- **GitHub**: Familiar platform for collaborative development and version control.
- **CircleCI**: Integration with GitHub and Heroku simplifies CI/CD automation. Facilitates testing, building, and deployment in one streamlined workflow.
- **Heroku**: Manages infrastructure, deployments, and scaling. Offers smooth integration with GitHub and CircleCI for continuous updates.
- **Firebase Firestore**: A scalable, NoSQL cloud database solution ideal for real-time data handling and synchronization. It simplifies backend configuration while offering secure storage.
- **Node.js**: Efficient, high-performance backend framework that supports scalability and real-time data handling.

## Pipeline Workflow

1. **Push Code to GitHub**: Developers push updates to the GitHub repository, triggering the CI/CD pipeline.
2. **CircleCI Runs Tests**: Automated tests validate code. If tests fail, the pipeline halts to prevent deployment.
3. **Build Process**: Successful tests lead to the application build phase.
4. **Heroku Deployment**: CircleCI deploys the latest version to Heroku for live access.
5. **Continuous Monitoring**: Heroku monitors uptime and handles scaling for a seamless user experience.

## Milestones

1. **Initial Setup and Infrastructure**:
   - Configure GitHub, CircleCI, Heroku, and Firebase.
2. **Core Search Engine Development**:
   - Develop search functionality, integrate travel APIs, and build the front-end and back-end.
3. **Save and Add Features**:
   - Enable users to save and add destinations to their profile.
4. **Authentication**:
   - Implement secure login and logout functionality.
5. **Testing and Continuous Deployment**:
   - Implement automated tests and ensure CI/CD pipeline reliability.
6. **Final Deployment and Launch**:
   - Deploy to production and launch for public use.

## Challenges

- **Data Integration**: Ensuring consistent and reliable information from various travel APIs.
- **Performance Optimization**: Providing fast, relevant results while managing large travel data sets.
- **User Experience**: Creating an intuitive, dynamic UI for real-time updates.
- **Scalability**: Handling growing user and search volumes.
- **CI/CD Automation**: Streamlining deployment processes during production-level releases.

## Conclusion

WhereNow? is a travel search platform that emphasizes efficiency and automation through CI/CD pipelines using GitHub, CircleCI, and Heroku. This version highlights secure user authentication, along with save and add features for destinations. Powered by Node.js and Firebase Firestore, WhereNow? delivers a reliable and scalable user experience.
