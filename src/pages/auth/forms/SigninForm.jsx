import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

//components 
import { Loader } from '@/components/shared';
//shadcn-ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { useSignInAccount } from '@/utilities/react-query/queries';
import { SigninValidation } from '@/utilities/validation';
import { useUserContext } from '@/context/AuthContext';

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Queries
  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  //Define your form.
  const form = useForm({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  //Define submit handler
  async function signinHandler(values) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: `Sign in failed session. Please try again`,
        variant: 'destructive',
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      return toast({
        title: 'Sign in failed login. Please try again',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />{' '}
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(signinHandler)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isPending || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
        <p className="small-regular text-light-2 text-center mt-2">
          Don't have an account?
          <Link to="/sign-up" className="text-primary-500 small-semibold ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SigninForm;
