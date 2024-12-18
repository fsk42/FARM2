"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, passwort }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, passwort);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    const user = await getUserInfo({ userID: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error(error);
  }
};

export const signUp = async ({ passwort, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  let newUserAccount;
  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      passwort,
      `${firstName} ${lastName}`
    );
    if (!newUserAccount) throw new Error("Fehler beim erstellen eines Users");

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userID: newUserAccount.$id,
      }
    );

    const session = await account.createEmailPasswordSession(email, passwort);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify(newUser);
  } catch (error) {
    console.error(error);
  }
};
export const getUserInfo = async ({ userID }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userID", [userID])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
    const user = await getUserInfo({ userID: result.$id });
    return parseStringify(user);
  } catch (error) {
    return null;
  }
}
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete("appwrite-session");
    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};
export async function getLoggedUserInfo() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
    const user = await getUserInfo({ userID: result.$id });

    return parseStringify(user.role);
  } catch (error) {
    console.log(error);
  }
}
export const getUserEmail = async ({ email }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("email", [email])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
export const getAllUserInfo = async () => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.select(["email", "userID", "firstName", "lastName", "Admin"])]
    );

    return parseStringify(user.documents);
  } catch (error) {
    console.log(error);
  }
};

export const updateUserAdminStatus = async (
  userID: string,
  newAdminStatus: string
) => {
  try {
    const { database } = await createAdminClient();

    // Zuerst suchen wir das Dokument mit der userID
    const users = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userID", [userID])]
    );

    if (users.documents.length === 0) {
      throw new Error("User not found");
    }

    const user = users.documents[0];

    // Jetzt aktualisieren wir das Dokument mit der korrekten $id
    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      user.$id,
      { Admin: newAdminStatus }
    );

    return parseStringify(updatedUser);
  } catch (error) {
    console.error("Error updating user Admin status:", error);
    throw error;
  }
};

export async function getLoggedInUserID() {
  try {
    const { account } = await createSessionClient();
    console.log("Session client created:", account);

    const result = await account.get();
    console.log("Account result:", result);

    const user = await getUserInfo({ userID: result.$id });
    console.log("User info:", user);

    const parsedUserID = parseStringify(user.userID);
    console.log("Parsed user ID:", parsedUserID);

    return parsedUserID;
  } catch (error) {
    console.error("Error in getLoggedInUserID:", error);
    return null;
  }
}

// export async function getLoggedUserInfoInfo(input: User) {
//   try {
//     const { account } = await createSessionClient();
//     const result = await account.get();
//     const user = await getUserInfo({ userID: result.$id });

//     return parseStringify(user.input);
//   } catch (error) {
//     console.log(error);
//   }
// }
// export async function getLoggedInUserInfo(infoProp: number) {
//   try {
//     const { account } = await createSessionClient();

//     const result = await account.get();
//     const user = await getUserInfo({ userID: result.$id });
//     return parseStringify(user[0]);
//   } catch (error) {
//     console.log(error);
//   }
// }
// export const getUserID = async ({ userID }: getUserInfoProps) => {
//   try {
//     const { database } = await createAdminClient();

//     const user = await database.listDocuments(
//       DATABASE_ID!,
//       USER_COLLECTION_ID!,
//       [Query.equal("userID", [userID])]
//     );

//     return parseStringify(user.documents[1]);
//   } catch (error) {
//     console.log(error);
//   }
// // };
// export async function getLoggedInUserProp(infoProp: string) {
//   try {
//     const { account } = await createSessionClient();
//     const result = await account.get();
//     const user = await getUserInfo({ userID: result.$id });
//     switch (infoProp) {
//       case "id":
//         return result.$id; // Rückgabe der Benutzer-ID
//       case "email":
//         return result.email; // Rückgabe der E-Mail-Adresse des Benutzers
//       case "firstName":
//         return result.firstName; // Rückgabe des Vornamens des Benutzers
//       case "lastName":
//         return result.lastName; // Rückgabe des Nachnamens des Benutzers
//       case "role-0":
//         return result.enum[0]; // Rückgabe des Namens des Benutzers
//     }
//   } catch (error) {
//     return null;
//   }
// }
