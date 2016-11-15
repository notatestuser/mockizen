# mockizen
A simple and flexible API mock for modern apps.
It lives in your project, hence its name.

It supports:
* Dumb responses (json)
* Clever responses (js)
* Stateful responses (soon)
* Faker and friends

## Show me a demo
Running the example is simple!

After cloning this...

```bash
$ npm install
$ npm start
$ open http://localhost:8090/users
```

## Using it for real
To add `mockizen` to your own project:

```bash
$ npm install --save-dev mockizen
$ npm install --global npm-add-script
$ touch scenarios.json
$ npmAddScript -k mocks:start -v "mockizen scenarios.json"
$ npm run mocks:start
```

## Example scenarios.json

Check `example/scenarios.json` for an example.

## Future work

- [ ] Swagger import
- [ ] REST routes generator
- [ ] Front page
- [ ] Live scenarios reload
