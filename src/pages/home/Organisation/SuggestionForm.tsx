import { InputText, PrimaryBtn, SelectInput, TextArea } from "@/components";

import FileUpload from "@/components/input/FileUpload";
import Toast from "@/config/Toast";
import { formattedTabs } from "@/constant/requestConstant";
import { orgSuggestion } from "@/services/request";
import { TRequestSuggestionPayload } from "@/types/requestTypes";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

interface IOrganzationProps {
  organizationName: string | undefined;
  isSuggestionForm: boolean;
  setSuggestionForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuggestionForm = ({
  organizationName,
  isSuggestionForm,
  setSuggestionForm,
}: IOrganzationProps) => {
  const { id } = useParams();
  const orgId = id || "";
  const navigate = useNavigate();
  const [image, setImage] = useState("");

  const { mutate: postSuggest } = useMutation(orgSuggestion, {
    onSuccess: () => {
      Toast.success("suggestion sent successfully");
      navigate(`/home/organisation/${orgId}`);
    },
    onError: (error: string) => {
      Toast.error(error);
    },
  });

  const initialValues: TRequestSuggestionPayload = {
    profileType: "addSuggestionToOrganization",
    recordSection: "",
    suggestionInput: "",
    suggestionDoc: "",
    imageDesc: "",
    link: "",
  };

  const onSubmit = (data: TRequestSuggestionPayload) => {
    const userData: TRequestSuggestionPayload = {
      profileType: data.profileType,
      recordSection: data.recordSection,
      suggestionInput: data.suggestionInput,
      suggestionDoc: image,
      organizationName,
      link: data.link,
    };
    const payload = { data: userData, organizationId: orgId };
    postSuggest(payload);
  };

  const { handleChange, values, handleSubmit, errors, touched } = useFormik({
    initialValues,
    onSubmit,
    validateOnBlur: true,
    enableReinitialize: true,
  });

  console.log(image);

  const getError = (key: keyof TRequestSuggestionPayload) => {
    return touched[key] && errors[key];
  };

  return (
    <div className="bg-white">
      <div className="p-10">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setSuggestionForm(!isSuggestionForm)}
        >
          <div>
            <IoIosArrowRoundBack size={20} />
          </div>
          <p>back</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-[40%] mx-auto py-[5em] space-y-4"
      >
        <p className="text-2xl font-semibold">
          Make suggestions for this profile
        </p>
        <p className="text-sm font-light">
          Use this form to suggest missing, outdated or incorrect information on
          this profile.
        </p>

        <SelectInput
          id={""}
          name="recordSection"
          value={values.recordSection}
          label={"Record Section *"}
          options={formattedTabs}
          error={getError("recordSection")}
          onChange={handleChange}
        />

        <TextArea
          name="suggestionInput"
          placeholder={"Enter suggestion"}
          label={"Suggestion Input *"}
          onChange={handleChange}
          value={values.suggestionInput}
        />

        <div className="space-y-2">
          <p className="text-sm ">Upload supporting document</p>
          <FileUpload
            setImage={setImage}
            image={image}
            flag="organizationDocuments"
          />
        </div>

        <InputText
          name={"imageDesc"}
          placeholder={"image description"}
          label={"Image description"}
          value={values.imageDesc}
          onChange={handleChange}
        />
        <InputText
          name={"suggestionDoc"}
          placeholder={"Document description"}
          label={"Document description"}
          value={values.suggestionDoc}
          onChange={handleChange}
        />

        <InputText
          name="link"
          value={values.link}
          placeholder={"Supporting Link"}
          label={"Supporting Link"}
          onChange={handleChange}
        />

        <PrimaryBtn text={"Send Suggestion"} className="w-[100%] h-[40px]" />
      </form>
    </div>
  );
};

export default SuggestionForm;
