export const to = (destination) =>
  window.history.push(
    typeof destination === 'string'
      ? {
          ...window.history.location,
          pathname: destination,
        }
      : destination
  );
