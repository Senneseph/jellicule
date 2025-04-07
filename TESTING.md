# Jellicule UI Testing Guide

This document provides information on how to test the Jellicule UI library.

## Testing Environment

The Jellicule UI library includes a testing environment that can be used to test the components and the service.

### Prerequisites

- Docker and Docker Compose
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Setting Up the Testing Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/jellicule/jellicule.git
   cd jellicule
   ```

2. Start the service:
   ```bash
   docker-compose up -d
   ```

3. Access the PWA:
   ```
   http://localhost:7327/
   ```

## Unit Tests

The Jellicule UI library includes unit tests for the components and the service.

### Running Unit Tests

To run the unit tests:

```bash
docker-compose exec jellicule bun test
```

### Writing Unit Tests

Unit tests are written using the Bun test framework. To write a unit test:

1. Create a new file in the `tests` directory with the name `<component-name>.test.js`.
2. Import the component to be tested.
3. Write the test cases.
4. Run the tests.

Example:

```javascript
// tests/activity.test.js
import { expect, test } from 'bun:test';
import { ActivityElement } from '../components/layout/Activity/activity.js';

test('Activity component renders correctly', () => {
  const activity = new ActivityElement();
  activity.textContent = 'Test Activity';
  
  expect(activity.textContent).toBe('Test Activity');
});

test('Activity component has selected attribute', () => {
  const activity = new ActivityElement();
  activity.setAttribute('selected', '');
  
  expect(activity.hasAttribute('selected')).toBe(true);
});
```

## Integration Tests

The Jellicule UI library includes integration tests for the components and the service.

### Running Integration Tests

To run the integration tests:

```bash
docker-compose exec jellicule bun test:integration
```

### Writing Integration Tests

Integration tests are written using the Bun test framework and the Puppeteer library. To write an integration test:

1. Create a new file in the `tests/integration` directory with the name `<feature-name>.test.js`.
2. Import the Puppeteer library.
3. Write the test cases.
4. Run the tests.

Example:

```javascript
// tests/integration/activity-bar.test.js
import { expect, test } from 'bun:test';
import puppeteer from 'puppeteer';

test('ActivityBar component renders activities correctly', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:7327/');
  
  const activities = await page.$$('activity');
  expect(activities.length).toBe(3);
  
  await browser.close();
});
```

## End-to-End Tests

The Jellicule UI library includes end-to-end tests for the components and the service.

### Running End-to-End Tests

To run the end-to-end tests:

```bash
docker-compose exec jellicule bun test:e2e
```

### Writing End-to-End Tests

End-to-end tests are written using the Bun test framework and the Puppeteer library. To write an end-to-end test:

1. Create a new file in the `tests/e2e` directory with the name `<feature-name>.test.js`.
2. Import the Puppeteer library.
3. Write the test cases.
4. Run the tests.

Example:

```javascript
// tests/e2e/pwa.test.js
import { expect, test } from 'bun:test';
import puppeteer from 'puppeteer';

test('PWA can be installed', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:7327/');
  
  // Check if the PWA is installable
  const installButton = await page.$('button[aria-label="Install Jellicule UI"]');
  expect(installButton).not.toBe(null);
  
  await browser.close();
});
```

## Manual Testing

The Jellicule UI library can also be tested manually using the PWA.

### Testing the Components

1. Access the PWA:
   ```
   http://localhost:7327/
   ```

2. Interact with the components to test their functionality.

### Testing the Service

1. Access the health dashboard:
   ```
   http://localhost:7327/dashboard
   ```

2. Check the health status of the service.

3. Access the API documentation:
   ```
   http://localhost:7327/meta/openapi.yaml
   ```

4. Test the API endpoints using a tool like curl or Postman.

## Continuous Integration

The Jellicule UI library includes a continuous integration (CI) pipeline that runs the tests automatically when changes are pushed to the repository.

### CI Pipeline

The CI pipeline includes the following steps:

1. Build the Docker image
2. Start the service
3. Run the unit tests
4. Run the integration tests
5. Run the end-to-end tests
6. Check the code coverage
7. Check the code style
8. Check the build status

### CI Configuration

The CI pipeline is configured in the `.github/workflows/ci.yml` file.

## Test Coverage

The Jellicule UI library aims for high test coverage. To check the test coverage:

```bash
docker-compose exec jellicule bun test:coverage
```

This will generate a coverage report in the `coverage` directory.

## Conclusion

Testing is an essential part of the development process. By following the guidelines in this document, you can ensure that the Jellicule UI library is thoroughly tested and functions correctly.
