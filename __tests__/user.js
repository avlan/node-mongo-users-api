/* eslint-env jest */

const request = require("supertest");
const httpStatus = require("http-status");
const app = require("../index");
const config = require("../config");

describe("## User APIs", () => {
  let user;

  beforeEach(() => {
    user = {
      username: `${+new Date()}@test.com`,
      name: "Test",
    };
  });

  describe(`# POST ${config.basePath}users`, () => {
    it("should create a new user", () =>
      request(app)
        .post(`${config.basePath}users`)
        .send(user)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body.name).toEqual(user.name);
        }));
    it("should get error for sending non especified values", () =>
      request(app)
        .post(`${config.basePath}users`)
        .send({ name: "Non valid", nonEspecified: "something" })
        .expect(httpStatus.BAD_REQUEST));
  });

  describe(`# GET ${config.basePath}users/:userId`, () => {
    it("should get user details", async () => {
      const { body: createdUser } = await request(app)
        .post(`${config.basePath}users`)
        .send(user);

      request(app)
        .get(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).toEqual(user.name);
        });
    });
    it("should get error for unexisting user", () =>
      request(app)
        .get(`${config.basePath}users/000000000000000000000001`)
        .expect(httpStatus.NOT_FOUND));
  });

  describe(`# PUT ${config.basePath}users/:userId`, () => {
    it("should get error for sending non especified values", async () => {
      const { body: createdUser } = await request(app)
        .post(`${config.basePath}users`)
        .send(user);

      await request(app)
        .put(`${config.basePath}users/${createdUser._id}`)
        .send({ name: "Non valid", nonEspecified: "something" })
        .expect(httpStatus.BAD_REQUEST);
    });
    it("should update user details", async () => {
      const newName = "Another test";

      const { body: createdUser } = await request(app)
        .post(`${config.basePath}users`)
        .send(user);

      return request(app)
        .put(`${config.basePath}users/${createdUser._id}`)
        .send({ name: newName })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.name).toEqual(newName);
        });
    });
    it("should get error for unexisting user", () =>
      request(app)
        .put(`${config.basePath}users/000000000000000000000001`)
        .expect(httpStatus.NOT_FOUND));
  });

  describe(`# DELETE ${config.basePath}users/:userId`, () => {
    it("should get error for unexisting user", async () =>
      request(app)
        .delete(`${config.basePath}users/000000000000000000000001`)
        .expect(httpStatus.NOT_FOUND));
    it("should delete user", async () => {
      const { body: createdUser } = await request(app)
        .post(`${config.basePath}users`)
        .send(user);

      await request(app)
        .delete(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body._id).toEqual(createdUser._id);
        });
    });
    it("should get not found by trying to delete that user again", async () => {
      const { body: createdUser } = await request(app)
        .post(`${config.basePath}users`)
        .send(user);

      await request(app).delete(`${config.basePath}users/${createdUser._id}`);

      await request(app)
        .delete(`${config.basePath}users/${createdUser._id}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
