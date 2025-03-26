# Jira Analytics Dashboard

A secure and responsive web application for displaying Jira issues and analytics for management meetings and presentations. This project allows teams to access, filter, and visualize Jira data without exposing sensitive API credentials to the client.

## AI Development Project

**This is an exploratory project developed 100% with AI assistance.** The entire codebase was created using GitHub Copilot in Visual Studio Code, primarily leveraging the Claude 3.7 Sonnet Thinking model. This project demonstrates how AI can be used to rapidly develop functional applications while maintaining good architectural practices and code quality.

For those interested in the AI collaboration process, check the [prompts.md](/docs/prompts.md) file which contains the conversations and prompts used to generate this project. This transparency aims to showcase modern AI-assisted development workflows and can serve as a learning resource for developers interested in AI pair programming.

![home](/docs/image.png)

![issues](/docs/image-1.png)

![issues list](/docs/image-2.png)

![issue detail](/docs/image-3.png)

## Features

- **Secure API Integration**: All Jira API calls happen server-side, keeping your credentials safe
- **Project Filtering**: View issues from specific projects
- **Advanced Filtering**: Filter by issue ID, status, sprint, and assignee with multi-select support
- **Data Visualization**: Summary cards and charts showing status distribution and assignee workload
- **Sprint Information**: View sprint details including start and end dates
- **Responsive Design**: Mobile-first layout that works well on all devices and for presentations
- **Dark/Light Mode**: Automatic theme switching based on system preferences

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: Turbopack

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/jira-analytics.git
   cd jira-analytics
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Create a .env.local file in the project root with your Jira credentials:
   ```
   JIRA_API_URL=https://your-domain.atlassian.net/rest/api/3
   JIRA_USER_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token
   ```

   > Note: To generate a Jira API token, go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JIRA_API_URL` | Your Jira instance REST API URL | Yes |
| `JIRA_USER_EMAIL` | Email associated with your Jira account | Yes |
| `JIRA_API_TOKEN` | Jira API token for authentication | Yes |

## Mock Data Mode

This application supports a "mock data" mode that activates automatically when the `JIRA_API_URL` environment variable is not provided. In this mode:

- No actual Jira API calls are made
- Sample data is generated for projects, issues, statuses, users, and sprints
- All functionality works with the sample data
- The application can be deployed to GitHub Pages without exposing credentials

To enable mock data mode:
1. Simply deploy without setting the Jira environment variables
2. Or, remove `JIRA_API_URL` from your `.env.local` file

This is perfect for demonstrations, public deployments, or development without a Jira instance.

## Usage

### Dashboard

The dashboard provides a quick overview with links to the main features of the application.

### Issues Page

The Issues page allows you to:
1. Select a project from the dropdown
2. Expand filters to further refine issues by ID, status, sprint, or assignee
3. View summary statistics and charts
4. See detailed issue data in a responsive table

### Issue Details

Click on any issue key in the table to view its complete details, including:
- Summary and description
- Status and assignee
- Sprint information with dates
- Project details
- Creation and update timestamps

## API Routes

The project uses Next.js API routes to securely communicate with the Jira API:

- `/api/projects` - Get all accessible projects
- `/api/issues` - Get issues with filtering
- `/api/statuses` - Get all available issue statuses
- `/api/users` - Get users within a project
- `/api/sprints` - Get sprints for a project

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Jira Cloud REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- Developed with [GitHub Copilot](https://github.com/features/copilot) and [Claude 3.7 Sonnet](https://www.anthropic.com/claude)

---

Made with ❤️ for better project visibility and AI-assisted development exploration