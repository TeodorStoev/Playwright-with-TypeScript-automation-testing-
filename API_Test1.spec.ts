import {test,expect, request} from '@playwright/test';

test('API Test Post', async ({ request }) => {
    const response = await request.post('https://petstore.swagger.io/v2/pet', {
        data: {
  "id": 1200,
  "category": {
    "id": 1,
    "name": "Кучета"
  },
  "name": "Бенджи",
  "photoUrls": [
    ""
  ],
  "tags": [
    {
      "id": 1,
      "name": "Домашен любимец"
    }
  ],
  "status": "available"
}
})
    expect(response.ok()).toBeTruthy();

    const name = (await response.json()).name;
    expect(name).toBe('Бенджи');

    console.log(name);
});

test('API Test Put', async ({ request}) => {
    const response = await request.put('https://petstore.swagger.io/v2/pet', {
        data: {
  "id": 1200,
  "category": {
    "id": 1,
    "name": "Кучета"
  },
  "name": "Бенджи-Updated",
  "photoUrls": [
    ""
  ],
  "tags": [
    {
      "id": 1,
      "name": "Домашен любимец"
    }
  ],
  "status": "available"
},
   
    })
    expect(response.ok()).toBeTruthy();

    const name = (await response.json()).name;
    expect(name).toBe('Бенджи-Updated');

    console.log(name);

    });

test('API Test Delete', async ({ request })=> {
    const response = await request.delete('https://petstore.swagger.io/v2/pet/1200');

    expect(response.ok()).toBeTruthy();
})

test('API Test Get', async ({ request })=> {

    const response = await request.get('https://petstore.swagger.io/v2/pet/1200');
   
    expect(response.status()).toBe(404);
    console.log(await response.json());

})
