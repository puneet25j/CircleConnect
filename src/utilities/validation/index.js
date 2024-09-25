import { z } from 'zod';

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const SignupValidation = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  username: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(passwordValidation, {
      message:
        'At least one uppercase letter, one lowercase letter, one number and one special character',
    }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const PostValidation = z.object({
  caption: z
    .string()
    .min(5, { message: 'Minimum 5 characters.' })
    .max(2200, { message: 'Maximum 2,200 caracters' }),
  file: z
    .array(
      z.custom((val) => val instanceof File),
      { message: 'Must be of file structure' }
    ),
  location: z
    .string()
    .min(2, { message: 'This field is required' })
    .max(1000, { message: 'Maximum 1000 characters.' }),
  tags: z.string(),
});

// // Function to test the validation
// const testPostValidation = (postData) => {
//   const result = PostValidation.safeParse(postData);

//   if (result.success) {
//     console.log("Validation Passed:", result.data);
//   } else {
//     console.log("Validation Failed:", result.error.errors);
//   }
// };

// // Sample data to test the validation
// const mockFile = new File(["file contents"], "file.txt", { type: "text/plain" });

// const postData = {
//   caption: "This is a valid caption",
//   file: mockFile,  // This should be an array of File objects
//   location: "New York",
//   tags: "travel"
// };

// // Test the validation
// testPostValidation(postData);
