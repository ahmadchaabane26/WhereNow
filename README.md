# Deploy WhereNow? - Vacation Search Web Application using CircleCI CI/CD Pipeline

## Project Description

WhereNow? is a travel search engine designed to help users discover destinations, accommodations, and activities tailored to their preferences. Users can input filters such as budget, location, climate, and interests like adventure, relaxation, or culture to receive curated travel suggestions.

### Key Features:

- Dynamic user interface with real-time updates as users refine their search.
- User accounts to save destinations and share personalized travel itineraries.
- Aggregation of data from various travel sites for flights, hotels, activities, and packages.
- CI/CD automation for seamless updates using GitHub, CircleCI, and Heroku.

The project leverages a cloud infrastructure and cutting-edge tools for deployment and data storage:

- **Front-end**: React.js
- **Back-end**: Node.js and Express.js
- **Database**: AWS PostgreSQL

## Team Members

- Ahmad Chaabane
- Christopher Cajamarca
- Caleb Riggs
- Kevin Pulickal
- Douglas Chi

## Tools and Technologies

| Tool Type          | Tool           |
| ------------------ | -------------- |
| **Source Control** | GitHub         |
| **Build and Test** | CircleCI       |
| **Deployment**     | Heroku         |
| **Programming**    | Node.js        |
| **Database**       | AWS PostgreSQL |

### Tool Justifications:

- **GitHub**: Familiar platform for collaborative development and version control.
- **CircleCI**: Integration with GitHub and Heroku simplifies CI/CD automation. Facilitates testing, building, and deployment in one streamlined workflow.
- **Heroku**: Manages infrastructure, deployments, and scaling. Offers smooth integration with GitHub and CircleCI for continuous updates.
- **AWS PostgreSQL**: A managed relational database solution that provides reliable, scalable, and secure data storage. Ideal for structured data with robust querying capabilities and better support for relational models than NoSQL databases.
- **Node.js**: Efficient, high-performance backend framework that supports scalability and real-time data handling.

## Pipeline Workflow

1. **Push Code to GitHub**: Developers push updates to the GitHub repository, triggering the CI/CD pipeline.
2. **CircleCI Runs Tests**: Automated tests validate code. If tests fail, the pipeline halts to prevent deployment.
3. **Build Process**: Successful tests lead to the application build phase.
4. **Heroku Deployment**: CircleCI deploys the latest version to Heroku for live access.
5. **Continuous Monitoring**: Heroku monitors uptime and handles scaling for a seamless user experience.

## Milestones

1. **Initial Setup and Infrastructure**:
   - Configure GitHub, CircleCI, Heroku, and AWS PostgreSQL.
2. **Core Search Engine Development**:
   - Develop search functionality, integrate travel APIs, and build the front-end and back-end.
3. **User Accounts and Personalization**:
   - Enable user accounts, save destinations, and store preferences.
4. **Testing and Continuous Deployment**:
   - Implement automated tests and ensure CI/CD pipeline reliability.
5. **Final Deployment and Launch**:
   - Deploy to production and launch for public use.

## Challenges

- **Data Integration**: Ensuring consistent and reliable information from various travel APIs.
- **Performance Optimization**: Providing fast, relevant results while managing large travel data sets.
- **User Experience**: Creating an intuitive, dynamic UI for real-time updates.
- **Scalability**: Handling growing user and search volumes.
- **CI/CD Automation**: Streamlining deployment processes during production-level releases.

## Conclusion

WhereNow? is a personalized travel search platform that leverages DevOps principles for automation and efficiency. With CI/CD pipelines using GitHub, CircleCI, and Heroku, the platform emphasizes continuous improvement and fast deployments. Powered by Node.js and AWS PostgreSQL, WhereNow? is designed for scalability and an enhanced user experience.

---
