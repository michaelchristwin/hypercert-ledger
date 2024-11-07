import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  title: string;
  description: string;
  link?: string;
  logo: string;
  bannerImage: string;
};
function FormComponent() {
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const {
    register,
    handleSubmit,
    // watch,
    //formState: { errors },
  } = useForm<Inputs>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title", { required: true })} />
    </form>
  );
}
export default FormComponent;
