# Project coding standards

This section list coding patterns promoted in the project.

## Avoid renderXyx patterns

#### :x: avoid

```typescript
const renderToggleIcon = useCallback(() => {
      if (isPassword) {
        return (
          <TouchableWithoutFeedback onPress={onIconPressed}>
            <View style={styles.containerIcon}>
              {isSecuredTextEntryEnabled ? <EyeSlash ... /> : <Eye ... />}
            </View>
          </TouchableWithoutFeedback>
        )
      }

      return null
    }, [isPassword, isSecuredTextEntryEnabled, onIconPressed])

...

return (
  <View>
    {renderToggleIcon()}
  </View>
)
```

#### :white_check_mark: prefer

````typescript
// define small dumb components with props
return (
  <View>
    <ToggleIcon isPassword={isPassword} onPress={onIconPressed}
      isSensitiveTextVisible={isSecuredTextEntryEnabled} />
  </View>
)```
````

#### :books:

the `useCallback` hook:

- should be used around _user interactions_ and not for rendering optimizations

References

- [3 React Mistakes, 1 App Killer](https://youtube.com/watch?v=QuLfCUh-iwI&si=JofynxnU-J58sA53)

creating small dumb components:

- removes template complexity
- promotes potential re-usability
- promotes separation of concerns
