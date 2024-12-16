Pa11y GitHub Action
This GitHub Action automates accessibility audits using Pa11y. It listens for specific comments on issues or pull requests and triggers the audit process accordingly.

Trigger Commands
To initiate the Pa11y audit, add one of the following comments to an issue or pull request:

Run Pa11y Audit on Main URLs

markdown
Copy code
/run-pa11y-action
Functionality:
Triggers the Pa11y audit on the main URLs of the repository. This action will:

Comment on the PR indicating the audit has started.
Perform the accessibility audit.
Deploy the audit report to GitHub Pages.
Comment with a link to the deployed audit results.
Run Pa11y Audit Using Sitemap

markdown
Copy code
/run-pa11y-action-sitemap
Functionality:
Triggers the Pa11y audit based on the URLs extracted from the sitemap located at https://www.8451.com/sitemap-0.xml. This action will:

Comment on the PR indicating the audit has started.
Extract URLs from the specified sitemap.
Perform the accessibility audit on the extracted URLs.
Deploy the audit report to GitHub Pages.
Comment with a link to the deployed audit results.
Audit Process Overview
When a trigger command is issued, the action performs the following steps:

Initialization

Detects the specific comment to determine which audit to run.
Comments on the pull request to notify that the audit has begun.
Setup Environment

Checks out the repository code.
Sets up Node.js environment.
Installs necessary dependencies (pa11y-ci, pa11y-ci-reporter-html, xml2js).
Installs and configures Google Chrome for the audit.
Configuration

Updates the Pa11y configuration with the path to the Chrome executable.
If running the sitemap audit, extracts URLs from the provided sitemap.
Run Pa11y Audit

Executes pa11y-ci to perform the accessibility checks.
Supports running audits on either the main URLs or URLs from the sitemap based on the command used.
Deploy Audit Report

Deploys the generated audit report to the gh-pages branch using GitHub Pages.
Report Results

Comments on the pull request with a link to the deployed audit results for easy access and review.
Accessing the Audit Report
After the audit completes, a comment will be added to the pull request with a link to the deployed Pa11y Audit Results hosted on GitHub Pages:

bash
Copy code
Deployed Pa11y Audit Results: https://CFsylvester.github.io/pa11y/pa11y-ci-report/
Click the link to view the detailed accessibility report.

Permissions
The action requires the following permissions to operate correctly:

id-token: Write
contents: Write
issues: Write
pull-requests: Write
These permissions allow the action to comment on issues and pull requests, deploy reports, and manage necessary content.

Notes
Ensure that the sitemap URL (https://www.8451.com/sitemap-0.xml) is accessible and correctly formatted for the sitemap audit command.
The action uses google-chrome-stable for running the audits. Make sure that the environment has access to install and run Chrome.
For any issues or enhancements, please open an issue in the repository.

License
This project is licensed under the MIT License.

Acknowledgements
Pa11y for providing accessibility auditing tools.
GitHub Actions for automation workflows.
Contact
For support or inquiries, please contact your-email@example.com.

Example Usage
Navigate to the relevant pull request or issue in your repository.
Add a comment with either /run-pa11y-action or /run-pa11y-action-sitemap based on your auditing needs.
Wait for the action to complete and review the results via the provided link.
