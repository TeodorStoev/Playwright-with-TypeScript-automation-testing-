

import {test, expect} from '@playwright/test';

test('E2E Test E-commerce Website', async ({page})=>
{
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button',{name: 'Login'}).click();
    await expect(page.getByText('Products')).toBeVisible();

    await page.locator('#add-to-cart-sauce-labs-bike-light').click();
    await page.locator('button[id="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
    await page.locator('#item_4_title_link').click();
    await expect(page.locator('.inventory_details_name.large_size')).toBeVisible();
    await page.getByRole('button',{name: 'Add to cart'}).click();
    await page.goBack();
    await page.locator('.shopping_cart_link').click();

    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(3);
   
    const expectedPrices: Record<string, string> = {
      'Sauce Labs Backpack': '$29.99',
      'Sauce Labs Bike Light': '$9.99',
      'Test.allTheThings() T-Shirt (Red)': '$15.99'
    };
      for (const [name, price] of Object.entries(expectedPrices)) {
      const row = page.locator('.cart_item', { hasText: name });
      await expect(row.getByText(name)).toBeVisible();
      await expect(row.locator('.inventory_item_price')).toHaveText(price);
    }

    await page.locator('button[id="remove-test.allthethings()-t-shirt-(red)"]').click();
    await expect(page.getByText('Test.allTheThings() T-Shirt (Red)')).not.toBeVisible();
    await page.locator("#checkout").click();

    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button',{name: 'Continue'}).click();

    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(2);

    const expectedRemainingPrices: Record<string, string> = {
      'Sauce Labs Backpack': '$29.99',
      'Sauce Labs Bike Light': '$9.99'
    };
    for (const [name, price] of Object.entries(expectedRemainingPrices)) {
      const row = page.locator('.cart_item', { hasText: name });
      await expect(row.getByText(name)).toBeVisible();
      await expect(row.locator('.inventory_item_price')).toHaveText(price);
    }

     const expectedSubtotal = Object.values(expectedRemainingPrices)
      .reduce((s, p) => s + Number(p.replace(/[^0-9.]/g, '')), 0);
    await expect(page.locator('.summary_subtotal_label'))
      .toHaveText(`Item total: $${expectedSubtotal.toFixed(2)}`); 

      const expectedTax = Number((expectedSubtotal * 0.08).toFixed(2));
    await expect(page.locator('.summary_tax_label'))
      .toHaveText(`Tax: $${expectedTax.toFixed(2)}`);

      const expectedTotal = Number((expectedSubtotal + expectedTax).toFixed(2));
    await expect(page.locator('.summary_total_label'))
      .toHaveText(`Total: $${expectedTotal.toFixed(2)}`);

      await page.locator('button[id="finish"]').click();
    await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();
    await page.locator('button[id="back-to-products"]').click();
    await expect(page.getByText('Products')).toBeVisible();
    await page.locator("#react-burger-menu-btn").click();
    await page.locator("#logout_sidebar_link").click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    await page.close();

});