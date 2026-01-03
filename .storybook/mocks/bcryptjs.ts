export const hash = async () => "mocked_hash";
export const compare = async () => true;
export const genSalt = async () => "mocked_salt";

const bcryptjsMock = { hash, compare, genSalt };
export default bcryptjsMock;
