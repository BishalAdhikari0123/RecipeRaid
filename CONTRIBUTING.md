# Contributing to Recipe Raid Co-op 🤝

Thank you for considering contributing to Recipe Raid Co-op! This document outlines the process and guidelines for contributing.

## 🎯 Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Let us know!
- ✨ **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 💻 **Code Contributions**: Submit pull requests
- 🎨 **Design**: Improve UI/UX
- 🧪 **Testing**: Write tests, find edge cases

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/recipe-raid.git
cd recipe-raid
```

### 3. Set Up Development Environment

Follow instructions in `QUICKSTART.md`:

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up database
createdb recipe_raid
psql -d recipe_raid -f server/database/schema.sql

# Configure environment variables
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
# Edit with your credentials
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📋 Development Guidelines

### Code Style

**TypeScript:**
- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types when possible
- Use interfaces for object types

**Naming Conventions:**
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Database tables: `snake_case`

**Formatting:**
- Indent: 2 spaces
- Quotes: Single quotes for strings
- Semicolons: Yes
- Trailing commas: Yes

### Project Structure

**Backend (server/):**
```
src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── middleware/     # Express middleware
├── routes/         # API routes
├── validations/    # Joi schemas
└── index.ts        # Server entry
```

**Frontend (client/):**
```
app/                # Next.js pages
├── [route]/        # Route folders
│   └── page.tsx    # Page component
components/         # Reusable components
lib/                # Utilities & helpers
public/             # Static assets
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add voice chat integration
fix: resolve raid completion bug
docs: update API documentation
style: format code with prettier
refactor: simplify authentication logic
test: add raid controller tests
chore: update dependencies
```

**Examples:**
```
feat(teams): add team chat functionality
fix(raids): prevent duplicate raid creation
docs(readme): add troubleshooting section
```

## 🐛 Bug Reports

### Before Submitting

1. Check existing issues
2. Try to reproduce consistently
3. Test on latest version

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen.

**Screenshots**
If applicable.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

**Additional context**
Any other relevant information.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Describe the problem.

**Proposed solution**
Describe your solution.

**Alternatives considered**
Other approaches you've thought about.

**Additional context**
Mockups, examples, etc.
```

## 💻 Pull Requests

### Before Submitting

1. **Test your changes thoroughly**
   ```bash
   # Backend
   cd server && npm run build
   
   # Frontend
   cd client && npm run build
   ```

2. **Update documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update API docs

3. **Write clear commit messages**

4. **Keep PRs focused**
   - One feature/fix per PR
   - Small, reviewable changes

### PR Process

1. **Create PR**
   - Use descriptive title
   - Fill out PR template
   - Link related issues

2. **PR Review**
   - Wait for maintainer review
   - Address feedback promptly
   - Keep discussion professional

3. **Merge**
   - Maintainers will merge when approved
   - Delete your branch after merge

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing

## Screenshots (if applicable)

## Related Issues
Fixes #123
```

## 🧪 Testing

### Writing Tests

We welcome test contributions!

**Backend Tests:**
```typescript
// Example test structure
describe('Auth Controller', () => {
  test('should register new user', async () => {
    // Test implementation
  });
});
```

**Frontend Tests:**
```typescript
// Example component test
describe('Navbar', () => {
  test('renders login button when not authenticated', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## 🎨 Design Contributions

We use Figma for design work. If you'd like to contribute designs:

1. Share mockups/wireframes
2. Follow existing design system
3. Consider mobile responsiveness
4. Ensure accessibility

**Design Principles:**
- Dark theme with purple/red accents
- Game-like aesthetic
- Clear visual hierarchy
- Accessible (WCAG AA)

## 📚 Documentation

### Areas Needing Docs

- API endpoint examples
- Component usage guides
- Deployment troubleshooting
- Feature tutorials
- Video walkthroughs

### Documentation Style

- Clear and concise
- Code examples included
- Screenshots when helpful
- Step-by-step instructions
- Beginner-friendly

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Given shoutouts on social media

## ❓ Questions?

- **GitHub Discussions**: For questions and discussions
- **Issues**: For bugs and features
- **Email**: support@reciperaid.com (if set up)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming language
- Being respectful of differing viewpoints
- Accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy

**Unacceptable behavior:**
- Trolling, insults, or derogatory comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Instances of abusive behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## 🎉 Thank You!

Your contributions make Recipe Raid Co-op better for everyone. We appreciate your time and effort!

**Happy Contributing! 🍳⚔️**
