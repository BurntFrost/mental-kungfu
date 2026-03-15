---
name: new-component
description: Create a new React component following project conventions (JSX, inline styles, functional component with hooks)
disable-model-invocation: true
---

# New Component

Create a new React component in the `src/` directory following this project's conventions.

## Arguments

- `name` (required): Component name in PascalCase (e.g., `CategoryFilter`)
- `path` (optional): Subdirectory under `src/` (default: `components/`)

## Conventions

1. **File format**: `.jsx` (not TypeScript yet)
2. **Style**: Inline styles using JavaScript objects — no CSS files or CSS-in-JS libraries
3. **Exports**: Default export of the component function
4. **Hooks**: Use React hooks (`useState`, `useEffect`, `useCallback`, etc.) as needed
5. **Color palette**: Match the existing dark theme:
   - Background: `#0a0a0a`, `#111`
   - Text: `#e0e0e0`, `#aaa`
   - Accent colors from categories (blues, purples, reds, greens)
6. **Props**: Destructure props in the function signature
7. **No external dependencies**: Use only React — no additional UI libraries

## Template

```jsx
import { useState } from "react";

export default function {{ComponentName}}({ /* props */ }) {
  const styles = {
    container: {
      // styles here
    },
  };

  return (
    <div style={styles.container}>
      {/* component content */}
    </div>
  );
}
```

## Steps

1. Create the component file at `src/{{path}}/{{ComponentName}}.jsx`
2. Follow the template above, adapting for the component's purpose
3. Export the component as default
4. If the component needs data, import from `src/data/` modules
