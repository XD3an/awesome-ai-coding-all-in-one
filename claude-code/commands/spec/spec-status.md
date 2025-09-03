# Spec Status Command

View the status and progress of a feature specification.

## Usage
```
/spec-status [feature-name]
```

## Instructions

You are helping the user track the progress of their feature specification development. This command provides a comprehensive overview of the current state.

### Status Check Process

1. **Locate Specification**
   - Check if `.claude/specs/{feature-name}/` directory exists
   - If no feature-name provided, list all available specifications

2. **Load Specification Documents**
   - Load requirements.md, design.md, and tasks.md (if they exist)
   - Check the completion status of each phase

3. **Analyze Task Progress**
   - Count total tasks vs completed tasks
   - Identify current task (first uncompleted task)
   - Calculate completion percentage
   - Show task dependency information if available

4. **Display Status Report**
   - **Phase Status**: Show which phases are complete (Requirements ✓, Design ✓, Tasks ✓)
   - **Task Progress**: Show completion statistics (X of Y tasks completed)
   - **Current Task**: Highlight the next task to work on
   - **Recent Activity**: Show recently completed tasks
   - **Blockers**: Identify any tasks that might be blocking progress

### Status Report Format

```
## Feature: {feature-name}

### Phase Status
- [x] Requirements (approved)
- [x] Design (approved) 
- [x] Tasks (approved)
- [ ] Implementation (in progress)

### Task Progress
- **Total Tasks**: 15
- **Completed**: 8 (53%)
- **Remaining**: 7 (47%)
- **Next Task**: Task 9 - Create API endpoints in src/api/feature.ts

### Recent Activity
- [x] Task 8 - Implement service layer (completed 2 hours ago)
- [x] Task 7 - Create data models (completed yesterday)

### Dependencies
- Task 10 depends on Task 9
- Task 11 can be done in parallel with Task 10
- Tasks 12-15 depend on Task 11 completion

### Blockers
- No blockers identified
```

### Error Handling

**If specification not found**:
- List available specifications in `.claude/specs/`
- Suggest creating a new spec with `/spec-create`

**If specification incomplete**:
- Show which phases are missing
- Suggest next steps to complete the specification

**If no tasks are defined**:
- Indicate that tasks.md is empty or missing
- Suggest running `/spec-create` to complete the workflow

### Examples

```bash
# Check specific feature status
/spec-status user-authentication

# List all specifications (when no feature name provided)
/spec-status
```

## Success Criteria

A complete status report includes:
- [x] Phase completion status
- [x] Task progress statistics 
- [x] Next recommended action
- [x] Dependency information
- [x] Blocker identification
- [x] Recent activity summary