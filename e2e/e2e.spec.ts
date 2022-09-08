import {Page, expect, test} from '@playwright/test'

test.describe('e2e tests', () => {
  let testPage: Page

  test.beforeEach(async ({page}) => {
    testPage = page
    // using baseURL defined in playwright.config
    await page.goto('')
  })

  test('page title is correct', async () => {
    // Expect a title "to contain" a substring.
    await expect(testPage).toHaveTitle(/Batman/)
  })

  test.describe('header module', () => {
    test('page header module is rendered', async () => {
      // create a locator
      const header = await testPage.locator('data-testid=module-federated-header')
      await expect(header).toBeTruthy()
    })

    test('page header module local state counter updates on button click', async () => {
      await expect(testPage.locator('.local_state_counter span')).toHaveText('0')
      await testPage.locator('.local_state_counter button').click()
      await expect(testPage.locator('.local_state_counter span')).toHaveText('1')
    })

    test('page header module state counter inc and dec on button click', async () => {
      await expect(testPage.locator('.header_counter span')).toHaveText('0')
      await testPage.locator('.header_counter button').first().click()
      await expect(testPage.locator('.header_counter span')).toHaveText('1')
      await testPage.locator('.header_counter button').last().click()
      await expect(testPage.locator('.header_counter span')).toHaveText('0')
    })
  })

  test.describe('footer module', () => {
    let footer: any
    test.beforeEach(async () => {
      footer = testPage.locator('data-testid=module-federated-footer')
    })

    test('page footer module is rendered', async () => {
      await expect(footer).toBeTruthy()
    })

    test('page footer module renders children text', async () => {
      await expect(footer).toHaveText('I AM THE FOOTERSSR footer!')
    })
  })

  // Expect an attribute "to be strictly equal" to the value.
  // await expect(getStarted).toHaveAttribute('data-testid', 'module-federated-footer')

  // Click the get started link.
  // await getStarted.click()

  // Expects the URL to contain intro.
  // await expect(page).toHaveURL(/.*intro/)
})
