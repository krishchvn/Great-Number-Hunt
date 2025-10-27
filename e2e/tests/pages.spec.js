import { test, expect } from '@playwright/test';
import fs from 'fs';

test('fetch all real page URLs', async ({ page }) => {
	// Read URLs from urls.json
	const data = JSON.parse(fs.readFileSync('urls.json', 'utf-8'));
	const urls = data.urls || [];
	const collectedTexts = [];
	const leftSpan = page.locator(
		'xpath=//*[@id="number-placeholder-left"]/div/span'
	);
	const rightSpan = page.locator(
		'xpath=//*[@id="number-placeholder-right"]/div/span'
	);
	let text = '';
	let i = 0;
	for (const url of urls) {
		console.log(i);
		i++;
		// console.log(`\n Visiting: ${url}`);
		await page.goto(url, { waitUntil: 'domcontentloaded' });
		// await page.waitForLoadState('load');
		const body = page.locator('body');
		await expect(body).toBeVisible();

		for (let i = 0; i < 5; i++) {
			const button = page.getByRole('button', { name: `Button ${i}` });
			await expect(button).toBeVisible();
			// await button.waitFor({ state: 'visible', timeout: 10000 });
			await button.click();
		}

		const button = page.getByRole('button', {
			name: '⭐ Row 2 - Click to expand',
		});
		await button.click();

		if ((await leftSpan.count()) > 0) {
			text = await leftSpan.textContent();
		} else if ((await rightSpan.count()) > 0) {
			text = await rightSpan.textContent();
		} else {
			throw new Error(`No span found for row: ${row.buttonName}`);
		}

		collectedTexts.push(text);
		// console.log(`📄 Row Text: ${text}`);
	}
	console.log(collectedTexts);
	console.log(collectedTexts.length);
	const total = collectedTexts.reduce((acc, curr) => acc + Number(curr), 0);
	console.log(total);
});
