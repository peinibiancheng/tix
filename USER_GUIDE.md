# Tix Ticket Management System - User Guide

## Getting Started

### First Time Setup

1. **Launch the Application**
   - Run `npm run tauri dev` for development
   - Or use the built installer for production

2. **Login**
   - Use the default credentials:
     - **Username**: `admin`
     - **Password**: `admin123`
   - Check "Remember me" to stay logged in

## Main Interface

### Dashboard Overview
After logging in, you'll see the main ticket management interface with:
- **Header**: Application title and user information
- **Ticket List**: Main area showing all tickets
- **Filters**: Search and filter controls
- **Create Button**: Add new tickets

## Managing Tickets

### Viewing Tickets
The ticket list displays:
- **Category**: Color-coded badges (Bug, Feature, Enhancement, Task, Support)
- **Title**: Ticket summary
- **Created Date**: When the ticket was created
- **Assignee**: Person responsible for the ticket
- **Reporter**: Person who created the ticket
- **Status**: Current ticket status (Open, In Progress, Closed, Resolved)

### Searching and Filtering

#### Text Search
- Use the search box to find tickets by title or description
- Search is case-insensitive and searches in real-time

#### Category Filter
- Select "All Categories" or specific category from dropdown
- Categories: Bug, Feature, Enhancement, Task, Support

#### Status Filter
- Select "All Statuses" or specific status from dropdown
- Statuses: Open, In Progress, Closed, Resolved

#### Sorting
- Click any column header to sort by that field
- Click again to reverse sort order
- Sort indicators (↑↓) show current sort direction

### Creating New Tickets

1. **Click "Create Ticket" button**
2. **Fill in the form**:
   - **Category**: Select from dropdown (required)
   - **Title**: Brief summary (required)
   - **Assignee**: Username of person to assign (required)
   - **Reporter**: Auto-filled with your username
   - **Description**: Detailed description (required)
3. **Click "Create Ticket"** to save
4. **Click "Cancel"** to discard changes

### Viewing Ticket Details

1. **Click any ticket row** to open detail view
2. **View all information** including full description
3. **Click "×" or outside modal** to close

### Editing Tickets

1. **Open ticket details** by clicking a ticket
2. **Click "Edit" button** in the detail view
3. **Modify fields** as needed:
   - Category, Title, Status, Assignee, Description
   - Reporter and dates cannot be changed
4. **Click "Save Changes"** to update
5. **Click "Cancel"** to discard changes

## User Interface Features

### Visual Indicators

#### Category Badges
- **Bug**: Red background - Critical issues
- **Feature**: Green background - New functionality
- **Enhancement**: Blue background - Improvements
- **Task**: Purple background - General tasks
- **Support**: Orange background - Support requests

#### Status Badges
- **Open**: Red - New, unassigned tickets
- **In Progress**: Orange - Currently being worked on
- **Closed**: Green - Completed tickets
- **Resolved**: Blue - Fixed and verified

### Responsive Design
- Interface adapts to different window sizes
- Mobile-friendly layout for smaller screens
- Consistent experience across platforms

## Tips and Best Practices

### Ticket Management
1. **Use descriptive titles** - Make it easy to understand the issue
2. **Choose appropriate categories** - Helps with organization and filtering
3. **Update status regularly** - Keep team informed of progress
4. **Assign tickets properly** - Ensure clear ownership
5. **Write detailed descriptions** - Include steps to reproduce, expected behavior, etc.

### Search and Organization
1. **Use filters effectively** - Combine category and status filters
2. **Sort by priority** - Use created date or status for prioritization
3. **Regular cleanup** - Close completed tickets
4. **Consistent naming** - Use standard terminology in titles

### Security
1. **Logout when done** - Especially on shared computers
2. **Use "Remember me" carefully** - Only on personal devices
3. **Keep credentials secure** - Don't share login information

## Keyboard Shortcuts

- **Esc**: Close modals and cancel operations
- **Enter**: Submit forms when focused on input fields
- **Tab**: Navigate between form fields

## Troubleshooting

### Common Issues

#### Login Problems
- **Invalid credentials**: Check username and password
- **Remember me not working**: Clear browser storage and try again

#### Ticket Issues
- **Tickets not loading**: Check database connection
- **Search not working**: Try clearing search and filters
- **Can't create tickets**: Ensure all required fields are filled

#### Performance Issues
- **Slow loading**: Check for large number of tickets
- **UI freezing**: Restart the application

### Getting Help
1. Check this user guide for common questions
2. Review the README.md for technical information
3. Check the application logs for error messages

## Data Management

### Backup
- Database file is stored locally as `tix.db`
- Regular backups recommended for important data
- Export functionality may be added in future versions

### Sample Data
The application comes with sample tickets to demonstrate features:
- Various categories and statuses
- Different assignees and reporters
- Realistic ticket descriptions

## Future Features

Planned enhancements include:
- File attachments for tickets
- Comment system for discussions
- Advanced reporting and analytics
- Multi-user management with roles
- Email notifications
- Import/export functionality

## Support

For technical support or feature requests:
1. Check the documentation first
2. Review the implementation summary
3. Submit issues through the appropriate channels

---

**Version**: 1.0.0  
**Last Updated**: December 2024
